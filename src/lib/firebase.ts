
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

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
if (process.env.NODE_ENV === 'development') {
    console.log("Firebase Initializing with Config:", {
        apiKeyExists: !!firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        appIdExists: !!firebaseConfig.appId
    });
}


if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase API Key or Project ID is missing. This is critical for Firebase services to work. " +
    "Check your .env.local file (or environment variables for deployment), ensure they are prefixed with NEXT_PUBLIC_, " +
    "and restart your development server if changes were made."
  );
}


let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth, GoogleAuthProvider };
