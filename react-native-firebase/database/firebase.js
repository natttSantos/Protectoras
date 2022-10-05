import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBtQ-Vg53ItNvDCtdzx7nEkwXDTCaAeIVg",
  authDomain: "react-native-firebase-a2b50.firebaseapp.com",
  projectId: "react-native-firebase-a2b50",
  storageBucket: "react-native-firebase-a2b50.appspot.com",
  messagingSenderId: "1075853783721",
  appId: "1:1075853783721:web:8a59bc8a9be4cb7e002fb8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); 

export default {
  firebase, 
  db, 
}
 