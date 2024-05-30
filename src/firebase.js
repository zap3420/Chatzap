import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, query, getDocs, where, doc, updateDoc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db, collection, query, getDocs, where, doc, updateDoc, setDoc, getDoc, onSnapshot };