// firebase v8 imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// firebase V9 imports
import {initializeApp, getApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, collection, where, getDocs, query, limit} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAnalytics, setAnalyticsCollectionEnabled} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCUVk5j-cUGV7Nx0Eo31KXOboJ57157dbY',
  authDomain: 'rafael-zasas.firebaseapp.com',
  databaseURL: 'https://rafael-zasas.firebaseio.com',
  projectId: 'rafael-zasas',
  storageBucket: 'rafael-zasas.appspot.com',
  messagingSenderId: '375732548823',
  appId: '1:375732548823:web:c21eb1a2ee999f5fcfac92',
  measurementId: 'G-P02BJLWNMK',
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

export const firebaseApp = createFirebaseApp(firebaseConfig); // V9 app
// const app = initializeApp(firebaseConfig); // V8 app

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// V8 Exports
export const auth = firebase.auth();
// export const analytics = getAnalytics(app);
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const githubAuthProvider = new firebase.auth.GithubAuthProvider();
export const appleAuthProvider = new firebase.auth.OAuthProvider('apple.com');
export const microsoftAuthProvider = new firebase.auth.OAuthProvider('microsoft.com');
export const firestore = firebase.firestore();

// V9 Exports

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';
