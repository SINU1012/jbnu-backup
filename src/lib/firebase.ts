import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBzwFUCejELEbp6viu0atfSiwdlJ9MU-Rg",
  authDomain: "jbnu-humanities.firebaseapp.com",
  projectId: "jbnu-humanities",
  storageBucket: "jbnu-humanities.firebasestorage.app",
  messagingSenderId: "745516028752",
  appId: "1:745516028752:web:6e6beb3bf5a8b11c1fd255",
  measurementId: "G-ZHWCTNQ62C",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, storage, analytics };
