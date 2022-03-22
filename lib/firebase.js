// firebase v8 imports
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// firebase V9 imports
import {initializeApp, getApp} from 'firebase/app';
// import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// import {getFirestore, collection, where, getDocs, query, limit} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// import {getAnalytics, setAnalyticsCollectionEnabled} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
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
