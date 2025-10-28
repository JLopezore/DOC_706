// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjaw7dRf1kNivZz4Phl6pZ7WW87DnNx18",
  authDomain: "my-snoopy-app.firebaseapp.com",
  projectId: "my-snoopy-app",
  storageBucket: "my-snoopy-app.firebasestorage.app",
  messagingSenderId: "28352394477",
  appId: "1:28352394477:web:a4ce6d901fa68df51088e4",
  measurementId: "G-C9VXXG2C9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Firestore y exportarlo para usarlo en la app
export const db = getFirestore(app);