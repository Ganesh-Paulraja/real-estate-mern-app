import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "mern-estate-84064.firebaseapp.com",
  projectId: "mern-estate-84064",
  storageBucket: "mern-estate-84064.appspot.com",
  messagingSenderId: "779948233088",
  appId: "1:779948233088:web:2afe5d6f77e27cb2903165"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);