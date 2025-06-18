// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIgli96xxywrmMq1FNLO-OfTwLvocwdSM",
  authDomain: "asaderofamiliar-authservice.firebaseapp.com",
  projectId: "asaderofamiliar-authservice",
  storageBucket: "asaderofamiliar-authservice.firebasestorage.app",
  messagingSenderId: "883902898937",
  appId: "1:883902898937:web:88b8821eb414c66214b828",
  measurementId: "G-J5MGS9WNTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;