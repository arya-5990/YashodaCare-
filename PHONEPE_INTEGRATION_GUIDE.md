# PhonePe Integration via Firebase Cloud Functions

To securely process ₹999 payments, we have to handle the PhonePe cryptography on a backend server. I have already wired your React frontend (`Plans.jsx`) to call a function named `createPhonePePayment`.

### Step 1: Initialize Firebase Functions
Open your terminal and run:
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```
*(Select Javascript, and do NOT overwrite any existing files like `.gitignore` if prompted).*

### Step 2: Install Dependencies inside the `functions` folder
```bash
cd functions
npm install axios crypto cors
```

### Step 3: Replace `functions/index.js`
Copy and paste the following code entirely into your new `functions/index.js` file:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// ---------- PHONEPE CONFIGURATION ----------
// Replace these with your actual PhonePe Production credentials
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"; // UAT URL
const MERCHANT_ID = "PGTESTPAYUAT"; 
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = 1;
// -------------------------------------------

exports.createPhonePePayment = functions.https.onCall(async (data, context) => {
  // 1. Validate Input
  const { userId, planId } = data;
  if (!userId || !planId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing userId or planId");
  }

  // 2. Fetch Plan Pricing Securely from Firestore (Never trust client prices)
  const planSnap = await admin.firestore().collection("plans").doc(planId.toString()).get();
  if (!planSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Plan not found");
  }
  
  const planData = planSnap.data();
  const amountInPaise = planData.discountedPrice * 100;

  // 3. Generate Unique Transaction ID & Log Pending Status
  const transactionId = `TXN_${Date.now()}_${userId}`;
  await admin.firestore().collection("transactions").doc(transactionId).set({
    userId: userId,
    planId: planId,
    amount: planData.discountedPrice,
    status: "PENDING",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // 4. Construct Official PhonePe Payload
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: userId.toString(),
    amount: amountInPaise,
    redirectUrl: "https://yashodacare.in/profile", // Where user goes after payment finishes
    redirectMode: "GET",
    callbackUrl: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/phonePeWebhook`, // Webhook URL
    mobileNumber: "9999999999", 
    paymentInstrument: { type: "PAY_PAGE" }
  };

  const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");

  // 5. Generate SHA256 Cryptographic Checksum
  const stringToSign = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
  const checksum = sha256 + "###" + SALT_INDEX;

  try {
    const response = await axios.post(`${PHONEPE_HOST_URL}/pg/v1/pay`, {
      request: base64EncodedPayload
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum
      }
    });

    if (response.data.success) {
      // 6. Return Secure URL to React Frontend
      return { redirectUrl: response.data.data.instrumentResponse.redirectInfo.url };
    } else {
      throw new functions.https.HttpsError("internal", "Gateway rejected payload");
    }
  } catch (err) {
    console.error("PhonePe Error:", err);
    throw new functions.https.HttpsError("internal", "Payment API error");
  }
});


// ---------- PHONEPE WEBHOOK (Updates User automatically) ----------
exports.phonePeWebhook = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { response } = req.body;
      if (!response) return res.status(400).send("No payload");

      const bufferObj = Buffer.from(response, "base64");
      const decodedPayload = JSON.parse(bufferObj.toString("utf8"));

      const transactionId = decodedPayload.data.merchantTransactionId;
      const status = decodedPayload.success ? "SUCCESS" : "FAILED";

      const txnRef = admin.firestore().collection("transactions").doc(transactionId);
      const txnSnap = await txnRef.get();
      
      if (txnSnap.exists && txnSnap.data().status === "PENDING") {
         await txnRef.update({ status: status });

         if (status === "SUCCESS") {
           // Payment went through! Give the user the plan.
           const { userId, planId } = txnSnap.data();
           
           const planSnap = await admin.firestore().collection("plans").doc(planId.toString()).get();
           const planTitle = planSnap.exists ? planSnap.data().title : "Premium Plan";

           await admin.firestore().collection("users").doc(userId.toString()).update({
              plan_id: planId,
              plan_title: planTitle,
              plan_purchased_at: new Date().toISOString()
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
```

### Step 4: Deploy
```bash
firebase deploy --only functions
```

Your React code in `Plans.jsx` is perfectly configured to call this function and redirect the user automatically to the payment gateway!
