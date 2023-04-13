// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmZba-04OYpfReZWG5eGake3sT2F52II4",
  authDomain: "lighthall-projects.firebaseapp.com",
  projectId: "lighthall-projects",
  storageBucket: "lighthall-projects.appspot.com",
  messagingSenderId: "611470732429",
  appId: "1:611470732429:web:3229007f403a40c70246c4",
  measurementId: "G-88V3FBFXJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { 
  db,
};