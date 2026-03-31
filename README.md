# Yashoda Care+

Modern React + Vite web application for the Yashoda Care+ experience –
showcasing plans, clinic benefits and providing a simple portal for
patient onboarding and profile management.

The project uses Firebase for authentication and data, plus Firebase
Cloud Functions for PhonePe payment integration.

---

## Tech Stack

- React 19 + Vite
- React Router for routing
- Tailwind CSS 4 for styling
- Framer Motion for animations
- Firebase (Firestore, Auth, Analytics)
- Firebase Cloud Functions (Node.js 20)
- PhonePe payment gateway integration
- bcryptjs for client-side password hashing

---

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended to match Cloud Functions runtime)
- npm (comes with Node)
- A Firebase project (for web app + Firestore)

### Install dependencies

Clone the repo, then in the project root:

```bash
npm install

cd functions
npm install
cd ..
```

### Environment variables (frontend)

Create a `.env.local` file in the project root with your Firebase
configuration:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

These values correspond to the config used in `src/firebase.js`.

### PhonePe configuration (backend)

PhonePe integration is implemented in Firebase Cloud Functions and
configured via `phonepe.env.yaml`.

For details on required keys, environment variables, and callback
handling, see:

- `PHONEPE_INTEGRATION_GUIDE.md`

---

## Running the app locally

From the project root:

```bash
# Start Vite dev server
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

To run Firebase Functions locally with emulators:

```bash
cd functions
npm run serve
```

This uses `firebase emulators:start --only functions` under the hood.

---

## Build & Preview

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The build output is written to `dist/` (Vite default).

---

## Project Structure

Key folders and files:

- `src/`
	- `main.jsx` – React entry point
	- `App.jsx` – Router and layout (navbar, footer, WhatsApp button)
	- `firebase.js` – Firebase initialization
	- `components/` – UI sections (Hero, Plans, Trust, ClinicExperience, etc.)
	- `pages/`
		- `Home.jsx` – main marketing/landing page
		- `PlansPage.jsx` – available plans and pricing
		- `Auth.jsx` – login/registration portal
		- `Profile.jsx` – basic user profile area
		- `Terms.jsx`, `Privacy.jsx` – legal content
- `functions/`
	- `index.js` – Firebase Cloud Functions (including PhonePe handlers)
	- `package.json` – Cloud Functions dependencies and scripts
- `public/` – static assets
- `vite.config.js` – Vite configuration

---

## Authentication & Data

- Users register and log in via a custom form (`pages/Auth.jsx`).
- User data is stored in Firestore (`users` collection) via `firebase.js`.
- Passwords are hashed client-side with `bcryptjs` before being
	persisted.
- User IDs are auto-incremented using a Firestore transaction on a
	`_metadata/userIdCounter` document.
- An `AuthContext` provider (`context/AuthContext.jsx`) keeps the
	authenticated user state across the app.

> Important: Always protect real user data and credentials. Use HTTPS
> in production and keep all secrets (Firebase, PhonePe) out of source
> control.

---

## Deployment

Frontend deployment is standard for any Vite React app – you can host
the contents of `dist/` on Firebase Hosting or any static host.

For Cloud Functions deployment (PhonePe integration and any other
backend logic):

```bash
cd functions
npm run deploy
```

Ensure you have the Firebase CLI installed and logged in (`firebase
login`) and that your `firebase.json` and `phonepe.env.yaml` are
correctly configured.

---

## License

Internal or project-specific use. If you plan to open-source or reuse
this code, update this section with the appropriate license.

