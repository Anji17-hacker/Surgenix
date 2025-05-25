// firebase/firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyAEh72DSKmdYVlsEj9hDIJmjrdKnoK82-g",
  authDomain: "hospitalscheduler-35b9c.firebaseapp.com",
  projectId: "hospitalscheduler-35b9c",
  storageBucket: "hospitalscheduler-35b9c.firebasestorage.app",
  messagingSenderId: "333731023686",
  appId: "1:333731023686:web:cceb314c6bec85cb36f347",
  measurementId: "G-54M50NWHXV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Declare globally so other scripts can use

const auth = firebase.auth();
const db = firebase.firestore();
// Make auth and db global
window.auth = auth;
window.db = db;