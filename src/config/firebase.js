import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA6oy293fvrbrypHl8P698KzCPqfGaWbx8",
  authDomain: "disainer-app.firebaseapp.com",
  databaseURL: "https://disainer-app-default-rtdb.firebaseio.com",
  projectId: "disainer-app",
  storageBucket: "disainer-app.firebasestorage.app",
  messagingSenderId: "622102470878",
  appId: "1:622102470878:web:47ba534463208000ec624f",
  measurementId: "G-THFT65ZJVW"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('Firebase initialized with apiKey:', firebaseConfig.apiKey);
console.log('Firebase app name:', app.name);

export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;
