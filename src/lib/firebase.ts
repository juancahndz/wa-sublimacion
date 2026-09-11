import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDk2HW-qLGkL7jia4v710ZkdM_dJz3yCc",
  authDomain: "wa-sublimacion.firebaseapp.com",
  projectId: "wa-sublimacion",
  storageBucket: "wa-sublimacion.firebasestorage.app",
  messagingSenderId: "148855628719",
  appId: "1:148855628719:web:70a947688de2e90273c55a",
  measurementId: "G-RF4F2672CQ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
