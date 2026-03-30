import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();

// Import Firebase Storage service which allows uploading and retrieving files (images, documents, etc.)
import {getStorage} from "firebase/storage"
// These credentials identify which Firebase project this frontend connects to.
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASURE_ID
};

// Initialize Firebase using the configuration above.
// This establishes the connection between the React application and the Firebase backend services.
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Storage service using the connected Firebase app.
// This instance will be used throughout the application to upload and retrieve files.
export const storage = getStorage(app);