const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors")({origin: true});

admin.initializeApp();

// ---------- PHONEPE CONFIGURATION ----------
// Prefer environment variables, but fall back to UAT sandbox
// values so development works even if env vars are not set.
// For production, override all of these with real credentials.
const PHONEPE_HOST_URL =
	process.env.PHONEPE_HOST_URL ||
	"https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";
const SALT_KEY =
	process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = Number(process.env.PHONEPE_SALT_INDEX || "1");
// -------------------------------------------

// Shared core logic so we can expose both a callable and
// an HTTPS endpoint (with explicit CORS) using the same code.
async function createPhonePePaymentCore({userId, planId}) {
	if (!userId || !planId) {
		throw new functions.https.HttpsError(
			"invalid-argument",
			"Missing userId or planId",
		);
	}

	const planSnap = await admin
		.firestore()
		.collection("plans")
		.doc(planId.toString())
		.get();

	if (!planSnap.exists) {
		throw new functions.https.HttpsError("not-found", "Plan not found");
	}

	const planData = planSnap.data();
	const amountInPaise = planData.discountedPrice * 100;

	const transactionId = `TXN_${Date.now()}_${userId}`;
	await admin
		.firestore()
		.collection("transactions")
		.doc(transactionId)
		.set({
			userId: userId,
			planId: planId,
			amount: planData.discountedPrice,
			status: "PENDING",
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});

	const payload = {
		merchantId: MERCHANT_ID,
		merchantTransactionId: transactionId,
		merchantUserId: userId.toString(),
		amount: amountInPaise,
		redirectUrl: "https://yashodacare.in/profile",
		redirectMode: "GET",
		callbackUrl:
			`https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/phonePeWebhook`,
		mobileNumber: "9999999999",
		paymentInstrument: {type: "PAY_PAGE"},
	};

	const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
	const base64EncodedPayload = bufferObj.toString("base64");

	const stringToSign = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
	const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");
	const checksum = `${sha256}###${SALT_INDEX}`;

	try {
		const response = await axios.post(
			`${PHONEPE_HOST_URL}/pg/v1/pay`,
			{request: base64EncodedPayload},
			{
				headers: {
					"Content-Type": "application/json",
					"X-VERIFY": checksum,
				},
			},
		);

		if (response.data.success) {
			return {
				redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
			};
		}
		console.error("PhonePe gateway rejected payload:", response.data);
		throw new functions.https.HttpsError("internal", "Gateway rejected payload");
	} catch (err) {
		// Log as much context as possible for debugging in Firebase logs
		if (err.response) {
			console.error("PhonePe Error response:", {
				status: err.response.status,
				data: err.response.data,
			});
		} else {
			console.error("PhonePe Error:", err);
		}

		let message = "Payment API error";
		if (err.response && err.response.data && err.response.data.message) {
			message += `: ${err.response.data.message}`;
		}
		throw new functions.https.HttpsError("internal", message);
	}
}

// Original callable function (still works for Firebase clients)
exports.createPhonePePayment = functions.https.onCall(async (data, context) => {
	return createPhonePePaymentCore({
		userId: data.userId,
		planId: data.planId,
	});
});

// Additional HTTPS endpoint with explicit CORS for direct fetch calls
exports.createPhonePePaymentHttp = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method === "OPTIONS") {
			// Handled by cors middleware
			return;
		}

		if (req.method !== "POST") {
			res.status(405).send("Method Not Allowed");
			return;
		}

		try {
			const {userId, planId} = req.body || {};
			const result = await createPhonePePaymentCore({userId, planId});
			res.status(200).json(result);
		} catch (err) {
			console.error("createPhonePePaymentHttp error:", err);
			if (err instanceof functions.https.HttpsError) {
				// Map HttpsError codes to more suitable HTTP status codes
				let status = 500;
				switch (err.code) {
					case "invalid-argument":
						status = 400;
						break;
					case "not-found":
						status = 404;
						break;
					case "internal":
						status = 502; // Bad gateway / upstream error
						break;
					default:
						status = 500;
				}
				res.status(status).json({
					code: err.code,
					message: err.message,
				});
			} else {
				res.status(500).json({
					code: "unknown",
					message: `Payment API error: ${err && err.message ? err.message : "Unknown error"}`,
				});
			}
		}
	});
});

// Webhook that PhonePe calls to confirm payment status
exports.phonePeWebhook = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		try {
			const {response} = req.body;
			if (!response) {
				res.status(400).send("No payload");
				return;
			}

			const bufferObj = Buffer.from(response, "base64");
			const decodedPayload = JSON.parse(bufferObj.toString("utf8"));

			const transactionId = decodedPayload.data.merchantTransactionId;
			const status = decodedPayload.success ? "SUCCESS" : "FAILED";

			const txnRef = admin
				.firestore()
				.collection("transactions")
				.doc(transactionId);
			const txnSnap = await txnRef.get();

			if (txnSnap.exists && txnSnap.data().status === "PENDING") {
				await txnRef.update({status});

				if (status === "SUCCESS") {
					const {userId, planId} = txnSnap.data();

					const planSnap = await admin
						.firestore()
						.collection("plans")
						.doc(planId.toString())
						.get();
					const planTitle = planSnap.exists
						? planSnap.data().title
						: "Premium Plan";

					await admin
						.firestore()
						.collection("users")
						.doc(userId.toString())
						.update({
							plan_id: planId,
							plan_title: planTitle,
							plan_purchased_at: new Date().toISOString(),
						});
						
					// Store successful transaction in purchases collection
					await admin
						.firestore()
						.collection("purchases")
						.doc(transactionId)
						.set({
							...txnSnap.data(),
							status: "SUCCESS"
						});
				}
			}

			res.status(200).send("OK");
		} catch (err) {
			console.error(err);
			res.status(500).send("Internal Server Error");
		}
	});
});

