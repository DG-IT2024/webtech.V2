// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyCaVB-HZM1y7OGGWn_UcZRp4iqQ3i7jI",
  authDomain: "aims-ed004.firebaseapp.com",
  projectId: "aims-ed004",
  storageBucket: "aims-ed004.firebasestorage.app",
  messagingSenderId: "572280357220",
  appId: "1:572280357220:web:9fb39a30d8201e940d7a71",
  measurementId: "G-D0HW69YK3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);