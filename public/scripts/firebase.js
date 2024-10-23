import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm3mwm9dxY1lxNZ4p251Ai_jzU5ElkMLc",
  authDomain: "notes-web-app-baa92.firebaseapp.com",
  projectId: "notes-web-app-baa92",
  storageBucket: "notes-web-app-baa92.appspot.com",
  messagingSenderId: "451453468892",
  appId: "1:451453468892:web:342ed28a3a410eb00cb419",
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
