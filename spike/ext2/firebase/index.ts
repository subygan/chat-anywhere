import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.PLASMO_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: import.meta.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
