// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARkmLjk_zs6kVyaRb43rgRLPWIkW1bRZU",
  authDomain: "house-marketplace-app-7d5ba.firebaseapp.com",
  projectId: "house-marketplace-app-7d5ba",
  storageBucket: "house-marketplace-app-7d5ba.appspot.com",
  messagingSenderId: "699981718005",
  appId: "1:699981718005:web:e98bd181e96b69b0f380bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();