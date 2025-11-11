// services/firebase.ts
// The Firebase configuration and initialization has been updated to use the v9+ modular SDK,
// which is required by the version specified in the importmap, fixing the import error.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp as firestoreServerTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARvkSBeH3jkG2phMG1E0CeA8p14bHKIyM",
  authDomain: "mente-e-calma-app.firebaseapp.com",
  projectId: "mente-e-calma-app",
  storageBucket: "mente-e-calma-app.firebasestorage.app",
  messagingSenderId: "649805212287",
  appId: "1:649805212287:web:c73de884d2c7c2108a2d4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const serverTimestamp = firestoreServerTimestamp;
