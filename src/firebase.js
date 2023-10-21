// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-state-f5edf.firebaseapp.com",
  projectId: "real-state-f5edf",
  storageBucket: "real-state-f5edf.appspot.com",
  messagingSenderId: "136867054466",
  appId: "1:136867054466:web:c388a58b930fefad46059b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
