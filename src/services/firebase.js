import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBVZo_lyMMIXva14N5hRoSZW4Gsdb3xEhE",
    authDomain: "ecofood-c9283.firebaseapp.com",
    projectId: "ecofood-c9283",
    storageBucket: "ecofood-c9283.firebasestorage.app",
    messagingSenderId: "589920883900",
    appId: "1:589920883900:web:675a0f3f28f8978624ecb9",
    measurementId: "G-V1EB6B9SF1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);
