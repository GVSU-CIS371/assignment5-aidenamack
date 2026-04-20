import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCFQJEAXROqAmjXamOfJjR7uIQRX2CUBDk",
  authDomain: "beveragemaker.firebaseapp.com",
  projectId: "beveragemaker",
  storageBucket: "beveragemaker.firebasestorage.app",
  messagingSenderId: "822763540532",
  appId: "1:822763540532:web:5b9bc7f755dfb12c6aba61",
  measurementId: "G-FHE461P26X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default db;
