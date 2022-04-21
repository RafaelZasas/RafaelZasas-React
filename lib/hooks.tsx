import {auth, db} from './firebase';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {doc, onSnapshot} from 'firebase/firestore';
import {UserData} from './types';
import {ToastData} from '../components/toast';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const userRef = doc(db, `users/${user.uid}`);

      unsubscribe = onSnapshot(userRef, (doc) => {
        setUserData({uid: doc.id, ...(doc.data() as UserData)});
      });
    } else {
      setUserData(null);
    }

    return unsubscribe;
  }, [user]);

  return {user, userData};
}

interface UseToastData {
  showToast: boolean;
  setShowToast: Dispatch<SetStateAction<boolean>>;
  toastData: ToastData;
  setToastData: Dispatch<SetStateAction<ToastData>>;
}

export function useToast(): UseToastData {
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<ToastData>();

  return {showToast, setShowToast, toastData, setToastData};
}
