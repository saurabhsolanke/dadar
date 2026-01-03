import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { Platform } from 'react-native';
// @ts-ignore

import { getReactNativePersistence } from 'firebase/auth';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
 apiKey: "AIzaSyAW-s9eHBf-c9fOZfql-j3MRYeF1FlEo-I",
  authDomain: "dadar-c2456.firebaseapp.com",
  projectId: "dadar-c2456",
  storageBucket: "dadar-c2456.firebasestorage.app",
  messagingSenderId: "776101172230",
  appId: "1:776101172230:web:3bdef1a95f7093c4315f87",
  measurementId: "G-WXW0Z0YR4Z"
};

// Initialize Firebase
let app: FirebaseApp;
let auth;
let analytics;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Initialize Auth with persistence
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

// Analytics (conditionally loaded as it might not be supported in all environments)
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});


// Initialize Firestore
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

export { analytics, app, auth, db, storage };

