
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'; // Added GoogleAuthProvider
// import { getFirestore } from "firebase/firestore"; // Example for Firestore
// import { getStorage } from "firebase/storage"; // Example for Storage

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log the projectId to help debug configuration issues
console.log("Firebase Initializing with Project ID:", firebaseConfig.projectId);
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase API Key is missing. Check your .env.local file, ensure it's prefixed with NEXT_PUBLIC_, and restart your dev server."
  );
}


let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
// const db = getFirestore(app); // Example for Firestore
// const storage = getStorage(app); // Example for Storage

export { app, auth, GoogleAuthProvider /*, db, storage */ }; // Export GoogleAuthProvider

