// firebase V9 imports
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions';
import {getMessaging, getToken} from 'firebase/messaging';

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

export const firebaseApp = initializeApp(firebaseConfig); // V9 app
// V9 Exports

//firestore exports
export const db = initializeFirestore(firebaseApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code == 'failed-precondition') {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//     // ...
//   } else if (err.code == 'unimplemented') {
//     // The current browser does not support all of the
//     // features required to enable persistence
//     // ...
//   }
// });

//auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
export const appleAuthProvider = new OAuthProvider('apple.com');
// export const microsoftAuthProvider = new OAuthProvider('microsoft.com');

// Functions
const functions = getFunctions(firebaseApp);
export const addPermissions = httpsCallable(functions, 'addPermissions');
// Storage exports
export const storage = getStorage(firebaseApp);

const EMULATORS_STARTED = 'EMULATORS_STARTED';
function startEmulators() {
  if (!global[EMULATORS_STARTED]) {
    global[EMULATORS_STARTED] = true;
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

if (process.env.NODE_ENV === 'development') {
  startEmulators();
}
