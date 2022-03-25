import {auth, db} from './firebase';
import {useEffect, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {doc, onSnapshot} from 'firebase/firestore';
import {UserData} from './types';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const userRef = doc(db, `users/${user.uid}`);

      unsubscribe = onSnapshot(userRef, (doc) => {
        setUserData({id: doc.id, ...(doc.data() as UserData)});
      });
    } else {
      setUserData(null);
    }

    return unsubscribe;
  }, [user]);

  return {user, userData};
}
