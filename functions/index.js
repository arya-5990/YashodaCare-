const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");

admin.initializeApp();

// ---------- RAZORPAY CONFIGURATION ----------
// NOTE: Razorpay is now deprecated in favour of Cashfree, but
// these keys are kept for backward compatibility until you
// fully switch and remove Razorpay from the project.
const RAZORPAY_KEY_ID = "rzp_test_SYaxvldiyvumrW";
const RAZORPAY_KEY_SECRET = "FAGSIZ6nlcQbr55Td6Cdvdab";

const razorpay = new Razorpay({
	key_id: RAZORPAY_KEY_ID,
	key_secret: RAZORPAY_KEY_SECRET,
});
// --------------------------------------------

// ---------- CASHFREE CONFIGURATION ----------
// For now we use your TEST keys directly so you
// can deploy without extra config. When you move
// to production, switch to environment variables.

const CASHFREE_APP_ID = "TEST11037912ca2f79f9e9289597351221973011";
const CASHFREE_SECRET_KEY = "cfsk_ma_test_df9ef8b28cf9c2757632020df3f7d705_bbad4d14";

// Optional overrides via environment variables
const CASHFREE_WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET || "";
const CASHFREE_ENV = process.env.CASHFREE_ENV || "sandbox";

const CASHFREE_API_VERSION = "2022-09-01";
const CASHFREE_BASE_URL =
	CASHFREE_ENV === "production"
		? "https://api.cashfree.com/pg"
		: "https://sandbox.cashfree.com/pg";
// --------------------------------------------

// -----------------------------------------------------------------
// 1. Create Razorpay Order  (called from frontend)
// -----------------------------------------------------------------
exports.createRazorpayOrder = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			res.status(405).send("Method Not Allowed");
			return;
		}

		try {
			// Coerce to strings — user.user_id is stored as a Number in Firestore
			const userId = String(req.body?.userId ?? "");
			const planId = String(req.body?.planId ?? "");

			if (!userId || !planId) {
				res.status(400).json({ error: "Missing userId or planId" });
				return;
			}

			// Fetch plan price securely from Firestore
			const planSnap = await admin
				.firestore()
				.collection("plans")
				.doc(planId)
				.get();

			if (!planSnap.exists) {
				res.status(404).json({ error: "Plan not found" });
				return;
			}

			const planData = planSnap.data();
			const amountPaise = Math.round(planData.discountedPrice * 100); // Razorpay uses paise

			// Create Razorpay order
			const order = await razorpay.orders.create({
				amount: amountPaise,
				currency: "INR",
				receipt: `rcpt_${Date.now()}_${userId.slice(0, 8)}`,
				notes: {
					userId,
					planId,
					planTitle: planData.title || "Membership Plan",
				},
			});

			// Log pending transaction in Firestore
			await admin
				.firestore()
				.collection("transactions")
				.doc(order.id)
				.set({
					userId: userId,
					planId: planId,
					amount: planData.discountedPrice,
					status: "PENDING",
					orderId: order.id,
					createdAt: admin.firestore.FieldValue.serverTimestamp(),
				});

			// Return order details + key to frontend
			res.status(200).json({
				orderId: order.id,
				amount: order.amount,
				currency: order.currency,
				keyId: RAZORPAY_KEY_ID,
			});
		} catch (err) {
			console.error("createRazorpayOrder error:", err);
			res.status(500).json({ error: err.message || "Failed to create order" });
		}
	});
});

// -----------------------------------------------------------------
// 1b. Create Cashfree Order  (new flow replacing Razorpay)
// -----------------------------------------------------------------
exports.createCashfreeOrder = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			res.status(405).send("Method Not Allowed");
			return;
		}

		if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
			console.error("Cashfree credentials are not configured");
			res
				.status(500)
				.json({ error: "Cashfree credentials not configured on server" });
			return;
		}

		try {
			const userId = String(req.body?.userId ?? "");
			const planId = String(req.body?.planId ?? "");

			if (!userId || !planId) {
				res.status(400).json({ error: "Missing userId or planId" });
				return;
			}

			// Fetch plan price securely from Firestore
			const planSnap = await admin
				.firestore()
				.collection("plans")
				.doc(planId)
				.get();

			if (!planSnap.exists) {
				res.status(404).json({ error: "Plan not found" });
				return;
			}

			const planData = planSnap.data();
			const amount = Number(planData.discountedPrice || 0);
			if (!amount || amount <= 0) {
				res.status(400).json({ error: "Invalid plan amount" });
				return;
			}

			// Fetch user details for Cashfree customer info
			const userSnap = await admin
				.firestore()
				.collection("users")
				.doc(userId)
				.get();

			const userData = userSnap.exists ? userSnap.data() : {};
			const customerEmail = userData.email || "no-email@yashodacare.in";
			const customerPhone = userData.phone || "9999999999";
			const customerName =
				userData.name || userData.fullName || userData.displayName || "Member";

			// Use our own orderId as Cashfree order_id so we can
			// directly map webhooks back to Firestore.
			const orderId = `CF_${Date.now()}_${userId.slice(0, 8)}`;

			// Log pending transaction in Firestore
			await admin.firestore().collection("transactions").doc(orderId).set({
				userId: userId,
				planId: planId,
				amount: amount,
				status: "PENDING",
				provider: "cashfree",
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			});

			// Construct Cashfree order payload
			const payload = {
				order_id: orderId,
				order_amount: amount,
				order_currency: "INR",
				customer_details: {
					customer_id: userId,
					customer_email: customerEmail,
					customer_phone: customerPhone,
					customer_name: customerName,
				},
				order_meta: {
					// User is redirected here after payment completion
					return_url:
						"https://www.smilesathi.in/profile?cf_order_id={order_id}",
					// Cashfree will send server-to-server notification to this URL
					notify_url: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/cashfreeWebhook`,
				},
				notes: {
					planId,
					planTitle: planData.title || "Membership Plan",
				},
			};

			const cfRes = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
				headers: {
					"x-client-id": CASHFREE_APP_ID,
					"x-client-secret": CASHFREE_SECRET_KEY,
					"x-api-version": CASHFREE_API_VERSION,
					"Content-Type": "application/json",
				},
			});

			const cfData = cfRes.data || {};
			const paymentSessionId = cfData.payment_session_id;

			if (!paymentSessionId) {
				console.error("Cashfree response missing payment_session_id", cfData);
				res.status(500).json({ error: "Failed to initialise payment session" });
				return;
			}

			res.status(200).json({
				orderId,
				paymentSessionId,
				env: CASHFREE_ENV,
			});
		} catch (err) {
			console.error("createCashfreeOrder error:", err.response?.data || err);
			res.status(500).json({
				error:
					err.response?.data?.message ||
					"Failed to create Cashfree order. Please try again.",
			});
		}
	});
});

// -----------------------------------------------------------------
// 2. Verify Payment  (called from frontend after Razorpay success)
// -----------------------------------------------------------------
exports.verifyRazorpayPayment = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			res.status(405).send("Method Not Allowed");
			return;
		}

		try {
			const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId } =
				req.body || {};

			if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
				res.status(400).json({ error: "Missing payment verification fields" });
				return;
			}

			// Verify HMAC-SHA256 signature
			const body = `${razorpay_order_id}|${razorpay_payment_id}`;
			const expected = crypto
				.createHmac("sha256", RAZORPAY_KEY_SECRET)
				.update(body)
				.digest("hex");

			if (expected !== razorpay_signature) {
				console.error("Signature mismatch — possible tampered payment");
				res.status(400).json({ error: "Payment signature verification failed" });
				return;
			}

			// Signature valid — mark transaction SUCCESS
			const txnRef = admin.firestore().collection("transactions").doc(razorpay_order_id);
			const txnSnap = await txnRef.get();

			// Fetch plan details for user update
			const resolvedPlanId = planId || txnSnap.data()?.planId;
			const resolvedUserId = userId || txnSnap.data()?.userId;

			const planSnap = resolvedPlanId
				? await admin.firestore().collection("plans").doc(resolvedPlanId.toString()).get()
				: null;

			const planTitle = planSnap?.exists ? planSnap.data().title : "Premium Plan";

			// Update transaction record
			await txnRef.set(
				{
					status: "SUCCESS",
					paymentId: razorpay_payment_id,
					signature: razorpay_signature,
					paidAt: admin.firestore.FieldValue.serverTimestamp(),
				},
				{ merge: true },
			);

			// Grant plan to user
			if (resolvedUserId) {
				await admin
					.firestore()
					.collection("users")
					.doc(resolvedUserId.toString())
					.update({
						plan_id: resolvedPlanId,
						plan_title: planTitle,
						plan_purchased_at: new Date().toISOString(),
					});

				// Mirror to purchases collection
				const txnData = txnSnap.exists ? txnSnap.data() : {};
				await admin
					.firestore()
					.collection("purchases")
					.doc(razorpay_order_id)
					.set({
						...txnData,
						status: "SUCCESS",
						paymentId: razorpay_payment_id,
					});
			}

			res.status(200).json({ success: true });
		} catch (err) {
			console.error("verifyRazorpayPayment error:", err);
			res.status(500).json({ error: err.message || "Verification failed" });
		}
	});
});

// -----------------------------------------------------------------
// 2b. Cashfree Webhook (server-to-server confirmation)
// -----------------------------------------------------------------
exports.cashfreeWebhook = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		try {
			// Verify webhook signature if a secret is configured
			if (CASHFREE_WEBHOOK_SECRET) {
				const signature = req.headers["x-webhook-signature"];
				if (!signature) {
					console.error("Missing Cashfree webhook signature header");
					res.status(400).send("Missing signature");
					return;
				}

				const expected = crypto
					.createHmac("sha256", CASHFREE_WEBHOOK_SECRET)
					.update(JSON.stringify(req.body))
					.digest("base64");

				if (expected !== signature) {
					console.error("Invalid Cashfree webhook signature");
					res.status(400).send("Invalid signature");
					return;
				}
			} else {
				console.warn("CASHFREE_WEBHOOK_SECRET not configured – skipping signature verification");
			}

			const event = req.body?.event;
			const order = req.body?.data?.order || {};
			const payment = req.body?.data?.payment || {};

			const orderId = order.order_id;
			const orderStatus = (order.order_status || "").toUpperCase();
			const paymentId = payment.payment_id;

			if (!orderId) {
				res.status(400).send("Missing order_id");
				return;
			}

			const isSuccess =
				orderStatus === "PAID" ||
				orderStatus === "SUCCESS" ||
				orderStatus === "COMPLETED" ||
				event === "payment.captured";

			const txnRef = admin.firestore().collection("transactions").doc(orderId);
			const txnSnap = await txnRef.get();

			if (!txnSnap.exists) {
				console.warn("Transaction not found for Cashfree order", orderId);
				res.status(200).send("OK");
				return;
			}

			const txnData = txnSnap.data() || {};

			// If already processed, do nothing
			if (txnData.status === "SUCCESS" || txnData.status === "FAILED") {
				res.status(200).send("OK");
				return;
			}

			const newStatus = isSuccess ? "SUCCESS" : "FAILED";

			await txnRef.set(
				{
					status: newStatus,
					provider: "cashfree",
					paymentId: paymentId || txnData.paymentId,
					paidAt: isSuccess
						? admin.firestore.FieldValue.serverTimestamp()
						: txnData.paidAt,
				},
				{ merge: true },
			);

			if (isSuccess) {
				const resolvedUserId = String(txnData.userId || "");
				const resolvedPlanId = String(txnData.planId || "");

				if (resolvedUserId && resolvedPlanId) {
					const planSnap = await admin
						.firestore()
						.collection("plans")
						.doc(resolvedPlanId)
						.get();

					const planTitle = planSnap.exists
						? planSnap.data().title
						: "Premium Plan";

					await admin
						.firestore()
						.collection("users")
						.doc(resolvedUserId)
						.update({
							plan_id: resolvedPlanId,
							plan_title: planTitle,
							plan_purchased_at: new Date().toISOString(),
						});

					// Mirror into purchases collection
					await admin
						.firestore()
						.collection("purchases")
						.doc(orderId)
						.set(
							{
								...txnData,
								status: "SUCCESS",
								paymentId: paymentId || txnData.paymentId,
								provider: "cashfree",
							},
							{ merge: true },
						);
				}
			}

			res.status(200).send("OK");
		} catch (err) {
			console.error("cashfreeWebhook error:", err);
			res.status(500).send("Internal Server Error");
		}
	});
});

// -----------------------------------------------------------------
// 3. Send Forgot Password OTP  (nodemailer via Gmail app password)
// -----------------------------------------------------------------
const GMAIL_USER = "smilesathiofficial@gmail.com";
const GMAIL_APP_PASS = "nwfm egwe urbf nzgv";

const mailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
});

exports.sendForgotPasswordOTP = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

		try {
			const { phone } = req.body || {};
			if (!phone) return res.status(400).json({ error: "Phone number is required" });

			// 1. Look up user by phone number
			const usersSnap = await admin
				.firestore()
				.collection("users")
				.where("phone", "==", phone)
				.get();

			if (usersSnap.empty) {
				return res.status(404).json({ error: "No account found with this phone number." });
			}

			const userDoc = usersSnap.docs[0];
			const userData = userDoc.data();
			const userId = String(userData.user_id);
			const email = userData.email;

			if (!email) {
				return res.status(400).json({ error: "No email linked to this account. Contact support." });
			}

			// 2. Generate 4-digit OTP
			const otp = String(Math.floor(1000 + Math.random() * 9000));

			// 3. Upsert into forgotpass collection (doc ID = userId for easy update)
			await admin
				.firestore()
				.collection("forgotpass")
				.doc(userId)
				.set(
					{
						user_id: userId,
						email: email,
						otp: otp,
						createdAt: admin.firestore.FieldValue.serverTimestamp(),
					},
					{ merge: true } // updates otp + createdAt, preserves user_id & email
				);

			// 4. Send OTP email via nodemailer
			await mailTransporter.sendMail({
				from: `"SmileSathi" <${GMAIL_USER}>`,
				to: email,
				subject: "Your SmileSathi Password Reset OTP",
				html: `
					<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e2e8f0;background:#fff">
						<h2 style="color:#0A1929;margin-bottom:8px">Password Reset</h2>
						<p style="color:#64748B;margin-bottom:24px">Use the OTP below to reset your SmileSathi account password. It is valid for <strong>10 minutes</strong>.</p>
						<div style="background:#F0FFF4;border:2px solid #74B72E;border-radius:8px;padding:20px;text-align:center">
							<span style="font-size:40px;font-weight:900;letter-spacing:16px;color:#0A1929">${otp}</span>
						</div>
						<p style="color:#94A3B8;font-size:13px;margin-top:24px">If you did not request this, please ignore this email. Do not share this OTP with anyone.</p>
						<hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0" />
						<p style="color:#CBD5E1;font-size:12px">SmileSathi &mdash; Aapki Smile Ka Lifeline Partner</p>
					</div>
				`,
			});

			// Return masked email for display (e.g. j***@gmail.com)
			const [localPart, domain] = email.split("@");
			const maskedEmail = localPart[0] + "***@" + domain;

			return res.status(200).json({ success: true, maskedEmail, userId });
		} catch (err) {
			console.error("sendForgotPasswordOTP error:", err);
			return res.status(500).json({ error: err.message || "Failed to send OTP" });
		}
	});
});

// -----------------------------------------------------------------
// 4. Reset Password with OTP verification
// -----------------------------------------------------------------
const bcrypt = require("bcryptjs");

exports.resetPasswordWithOTP = functions.https.onRequest(async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

		try {
			const { userId, otp, newPassword } = req.body || {};
			if (!userId || !otp || !newPassword)
				return res.status(400).json({ error: "Missing required fields" });

			if (newPassword.length < 6)
				return res.status(400).json({ error: "Password must be at least 6 characters" });

			// 1. Fetch otp document
			const otpDoc = await admin.firestore().collection("forgotpass").doc(String(userId)).get();
			if (!otpDoc.exists) return res.status(400).json({ error: "OTP expired or not found. Request a new one." });

			const otpData = otpDoc.data();

			// 2. Check 10-min expiry
			const createdAt = otpData.createdAt?.toMillis ? otpData.createdAt.toMillis() : Date.now();
			if (Date.now() - createdAt > 10 * 60 * 1000) {
				await otpDoc.ref.delete();
				return res.status(400).json({ error: "OTP has expired. Please request a new one." });
			}

			// 3. Verify OTP
			if (otpData.otp !== otp) return res.status(400).json({ error: "Incorrect OTP. Please try again." });

			// 4. Hash new password and update user
			const hashed = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
			await admin.firestore().collection("users").doc(String(userId)).update({ password: hashed });

			// 5. Clean up OTP document
			await otpDoc.ref.delete();

			return res.status(200).json({ success: true });
		} catch (err) {
			console.error("resetPasswordWithOTP error:", err);
			return res.status(500).json({ error: err.message || "Reset failed" });
		}
	});
});
