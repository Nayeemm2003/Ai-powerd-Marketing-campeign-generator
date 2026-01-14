// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJcMpJpuNIEzNWwLw9Hvk4NCTxAtbkDRQ",
  authDomain: "reachmatix.firebaseapp.com",
  projectId: "reachmatix",
  storageBucket: "reachmatix.firebasestorage.app",
  messagingSenderId: "742319007201",
  appId: "1:742319007201:web:e4cd5f5f8c4463e78c1ea0",
  measurementId: "G-1M7V14ZE34",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

//   inputs

const sbtn = document.getElementById("sign-submit");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (!sessionStorage.getItem("redirectedOnce")) {
      sessionStorage.setItem("redirectedOnce", "true");
      window.location.href = "workspace.html";
    }
  }
});

sbtn.addEventListener("click", () => {
  const email = document.getElementById("sign-email").value;
  const password = document.getElementById("sign-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;

      // save user data
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        plan: "free-user",
      });

      console.log(user);

      // navigate to login form
      const loginForm = document.querySelector(".loginForm");
      welcomeLogin.style.transform = "scale(0)";
      signUpForm.style.transform = "scale(0)";
      loginForm.style.transform = "scale(1)";
      // ...
    })
    .catch((error) => {
      console.log(error);
      // ..
    });
});

// google sign up

const googleSignUp = document.getElementById("google-signUp");

googleSignUp.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;

      // saving google user in firestore

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        provider: "google",
        createdAt: new Date(),
      });

      console.log("Google Logged In:", user);
      window.location.href = "workspace.html";
    })
    .catch((error) => {
      console.log("Google Login Error:", error.message);
    });
});
