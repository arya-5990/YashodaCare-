# Yashoda Care+ (SmileSathi Platform)

Modern React + Vite web application for the Yashoda Care+ (SmileSathi) experience –
showcasing membership plans, modern clinic benefits, dynamic assets, and providing a powerful portal for
patient onboarding, profile management, and a full-fledged Admin dashboard.

This application uses a fully serverless architecture built on top of **Firebase** (Firestore, Auth, Functions) with deep integrations to **Cashfree** (and previously PhonePe/Razorpay) for robust payment processing, and **Cloudinary** for scalable image management.

---

## 🌟 Key Features

**Patient Facing Portal**
* **Dynamic Landing Page & Plans**: Grid-based UI with dynamic "Best Seller" highlights powered by Firestore.
* **Membership Flow**: Real-time plan tracking with an animated visual progress bar calculating expiry from flexible duration inputs (days, months, years).
* **Profile Management**: Profile plan display, user referral codes tracking, and detailed transaction history.
* **Clinic & Doctors Showcase**: A fully dynamic gallery and doctors list rendered directly from Firestore (`assets` collection), featuring specialty, descriptions, and "Gold Medalist" badges.
* **Forgot Password Logic**: OTP-based asynchronous password reset driven by Firebase Cloud Functions and Nodemailer.

**Admin Dashboard Workflow**
* **Products Management**: Full CRUD interface for the `products` collection, including drag-and-drop image uploads directly piped to Cloudinary.
* **Plan Control**: Creation, updating, and **deletion** functionality for membership plans.
* **Granular Tracking (Patient Utilization Tracker)**: Admin controls to toggle usage points (e.g., "1 cleaning per year") dynamically updating Firestore arrays via atomic operators seamlessly avoiding race conditions. 

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Custom Auth Context + bcryptjs

### Backend / Serverless
- **Compute**: Firebase Cloud Functions (Node.js 20 runtime)
- **Database**: Cloud Firestore (NoSQL)
- **Payment Gateways**: Cashfree Payments (Primary), Razorpay (Legacy support)
- **Emails**: Nodemailer with SMTP
- **Security**: Strict CORS configurations

### Infrastructure
- **Hosting**: Firebase Hosting / Vercel
- **Asset Storage**: Cloudinary (for direct browser uploads of admin assets)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ (Node 20 recommended to match Cloud Functions runtime)
- npm or yarn
- Firebase account & initialized project (Firestore, Web app config)
- Cashfree Merchant credentials
- Cloudinary Account (for product/asset uploads)
- A Gmail account with an "App Password" (for Nodemailer functionality)

### Installation

Clone the repository and install dependencies for both the frontend and backend workflows:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd functions
npm install
cd ..
```

---

## 🔑 Environment Variables

The application requires various environment variables for both the client and the backend to function correctly. 

### Frontend (`.env.local` or `.env` inside root directory)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary Integration (Required for Admin dashboard uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Backend (`functions/phonepe.env.yaml` or Firebase secrets)
Payment settings and webhook endpoints are handled in `functions`. (Note: Ensure Cashfree and Razorpay secrets are provided in the Cloud functions environment directly or stored securely using Firebase Secret Manager).

```yaml
# Used primarily for Cashfree Payments
CASHFREE_APP_ID: "your_cashfree_app_id"
CASHFREE_SECRET_KEY: "your_cashfree_secret_key"
CASHFREE_WEBHOOK_SECRET: "your_cashfree_webhook_secret"
CASHFREE_ENV: "production" # or "sandbox"
```
*(See `PHONEPE_INTEGRATION_GUIDE.md` for extended details if transitioning payment vendors).*

---

## 🗄️ Database Schema 

The Firestore NoSQL database contains the following key collections:

1. **`users`**: Contains document metadata like `user_id` (auto-incremented), `name`, `email`, `phone`, `password` (hashed locally by `bcryptjs`), and plan status (`plan_id`, `plan_purchased_at`). Includes user `referral`.
2. **`plans`**: Contains the membership packages (`title`, `discountedPrice`, `duration`, features arrays, bestseller toggle).
3. **`products`**: A collection managing the physical products with names, prices, and `imageUrl` matching Cloudinary.
4. **`assets`**: Hosts the `doctors` array mapping (name, specialty, images, descriptions etc), and general Clinic site image references.
5. **`transactions`**: Stores intermediary payment lifecycles and order IDs.
6. **`purchases`**: Single point of truth for definitively settled success payments.
7. **`forgotpass`**: Ephemeral collection resolving user phone and OTP mappings expiring after 10 minutes.

---

## 💳 Payments Integration Workflows
The project has undergone rigorous payment refactoring transitioning toward Cashfree. The lifecycle process involves:
1. **Initiation**: The frontend calls the localized `/createCashfreeOrder` cloud function. 
2. **Cashfree Checkout**: Validates the payload using secret keys to generate a secure temporal `paymentSessionId`.
3. **Frontend Return**: Redirection routing points back to `https://www.smilesathi.in/profile` minimizing 404 UX errors.
4. **Webhook Listening (`/cashfreeWebhook`)**: True fulfillment happens via server-2-server webhook parsing. Verifying against the `x-webhook-signature`, querying Firestore transaction documents, logging it, and directly altering the target `userId` in the `users` and `purchases` collections.

---

## 💻 Local Development

### Start the Frontend Dev Server
Run from the root of the project:
```bash
npm run dev
```

### Spin up Local Firebase Emulators
The project includes a robust emulation target for debugging endpoints and avoiding Sandbox rate-limits.
```bash
cd functions
npm run serve
```
*(This triggers `firebase emulators:start --only functions`)*

### Build for Production
```bash
npm run build
npm run preview
```
Output bundles generated into `dist/`.

---

## 🚀 Deployment Process

1. **Deploy Frontend:**
Usually handled by continuous workflows targeting Vercel (`vercel.json` included) or Firebase Hosting. Simply point your pipeline to `dist/`.

2. **Deploy Backend Functions:**
Remember to deploy Cloud functions locally using Firebase CLI tools:
```bash
cd functions
firebase deploy --only functions
```
Ensure cors is configured within the Google Cloud console to not drop frontend OPTIONS pre-flight checks if changing hosting domains.

---

## 📜 License
Internal or project-specific use. If you plan to open-source or reuse this code, update this section with the appropriate license. Make sure to strip personal integration secrets prior to distributing.
