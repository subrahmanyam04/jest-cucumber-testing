// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMEZ6u1qnR3IH3AQERFgpM0BRKHEP05gs",
  authDomain: "simple-task-34c85.firebaseapp.com",
  databaseURL: "https://simple-task-34c85-default-rtdb.firebaseio.com",
  projectId: "simple-task-34c85",
  storageBucket: "simple-task-34c85.appspot.com",
  messagingSenderId: "165199429235",
  appId: "1:165199429235:web:7d901ff221e6faefd7f406"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);