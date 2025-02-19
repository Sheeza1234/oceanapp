// fireBaseConfig.js
import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyD92RJjITe-GFoj5cgxTtrCWRNH9ExpJyM",
  authDomain: "myoceanapp.firebaseapp.com",
  projectId: "myoceanapp",
  storageBucket: "myoceanapp.firebasestorage.app",
  messagingSenderId: "455654915544",
  appId: "1:455654915544:web:23f387a3f0c39b5fa3c6ad",
  measurementId: "G-9WN00FEMRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
const storage = getStorage(app);
export { auth,db,storage }; 

