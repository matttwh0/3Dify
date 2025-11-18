import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDn2EB9SmFvmEf2ciPPVjOhcO0MQLKJnY4",
  authDomain: "dify-86229.firebaseapp.com",
  projectId: "dify-86229",
  storageBucket: "dify-86229.firebasestorage.app",
  messagingSenderId: "348783696465",
  appId: "1:348783696465:web:7cbecbe7dded7a63a13670",
  measurementId: "G-QV4EGDW30N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);