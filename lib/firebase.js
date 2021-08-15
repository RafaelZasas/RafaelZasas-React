import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const  firebaseConfig = {
    apiKey: "AIzaSyCUVk5j-cUGV7Nx0Eo31KXOboJ57157dbY",
    authDomain: "rafael-zasas.firebaseapp.com",
    databaseURL: "https://rafael-zasas.firebaseio.com",
    projectId: "rafael-zasas",
    storageBucket: "rafael-zasas.appspot.com",
    messagingSenderId: "375732548823",
    appId: "1:375732548823:web:3c465b7a35ebd7c3cfac92",
    measurementId: "G-J0L7F1422H"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
