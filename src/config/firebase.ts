import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "./serviceAccountKey.json";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const auth = getAuth();
// connectAuthEmulator(auth, "http://127.0.0.1:9099"); //TODO remove in prod

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

const adminVerifyToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};

export { adminVerifyToken, auth };
