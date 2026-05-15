import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Estos datos los sacas de tu proyecto en Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDJ-FRSftzeGZuZQjwhe4j7rkX59jS1P3M",
    authDomain: "whatsapp-2453b.firebaseapp.com",
    projectId: "whatsapp-2453b",
    storageBucket: "whatsapp-2453b.firebasestorage.app",
    messagingSenderId: "260297938192",
    appId: "1:260297938192:web:6360b6142d9c56c176c195"
};

const app = initializeApp(firebaseConfig);

// Exportamos lo que vamos a usar
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider(); 