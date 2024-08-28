// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBB56Y80nPHh35pd1OfawGjFSVKXiUMKRI',
  authDomain: 'questionapp-97a0b.firebaseapp.com',
  projectId: 'questionapp-97a0b',
  storageBucket: 'questionapp-97a0b.appspot.com',
  messagingSenderId: '906710465388',
  appId: '1:906710465388:web:a4ed843b78d2544ae79149',
  measurementId: 'G-G4Y4KMHG4L',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestoreのインスタンスを取得
export const firestore = getFirestore(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
