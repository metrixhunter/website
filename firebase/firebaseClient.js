// firebase/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLYHfSdkiYnv5Apcaq4mLRgPM58prSZok",
  authDomain: "helos-8d260.firebaseapp.com",
  projectId: "helos-8d260",
  storageBucket: "helos-8d260.appspot.com", // ✅ fixed
  messagingSenderId: "382946317833",
  appId: "1:382946317833:web:f4dc2126a2251e9c7c8ad8",
  measurementId: "G-8J85PSR28M"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
