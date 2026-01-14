// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJcMpJpuNIEzNWwLw9Hvk4NCTxAtbkDRQ",
  authDomain: "reachmatix.firebaseapp.com",
  projectId: "reachmatix",
  storageBucket: "reachmatix.firebasestorage.app",
  messagingSenderId: "742319007201",
  appId: "1:742319007201:web:e4cd5f5f8c4463e78c1ea0",
  measurementId: "G-1M7V14ZE34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// button
const sbtn = document.getElementById("sign-submit");

// login function
sbtn.addEventListener("click", () => {
  const email = document.getElementById("sign-email").value;
  const password = document.getElementById("sign-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in:", user);

      // redirect
      window.location.href = "workspace.html";
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
});
