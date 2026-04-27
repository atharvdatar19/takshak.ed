import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate Firebase config
export const isFirebaseConfigured = Object.values(firebaseConfig).every(val => val && val.trim())

if (!isFirebaseConfigured) {
  console.warn("[TAKSHAK] Firebase configuration incomplete. Auth will run in DEMO MODE.")
}

// Initialize Firebase only if configured
let app, auth, db

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    
    // Set persistence to LOCAL so users stay logged in
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn("[TAKSHAK] Failed to set auth persistence:", err.message)
    })
  } catch (error) {
    console.error("[TAKSHAK] Firebase initialization failed:", error)
  }
}

export { app, auth, db }
