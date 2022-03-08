import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
};
export const fibaseInstance = initializeApp(firebaseConfig);
export const authService = getAuth();
export const dbService = getFirestore();
// export const storageBucket = getStorage(firebaseConfig);