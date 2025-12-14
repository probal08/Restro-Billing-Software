// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// We need Firestore and Auth, so we import them here
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8Aeuvf_7sgaTqYqv8v5pHiUMsqvFn2Fk",
  authDomain: "restaurantbackend-49375.firebaseapp.com",
  projectId: "restaurantbackend-49375",
  storageBucket: "restaurantbackend-49375.firebasestorage.app",
  messagingSenderId: "896181562865",
  appId: "1:896181562865:web:eea925350f0efd4b3a2850",
  measurementId: "G-8P8D9RGMX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need for other files
export const db = getFirestore(app);
export const auth = getAuth(app);
// test update