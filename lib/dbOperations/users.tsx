import {doc, DocumentReference, FirestoreError} from '@firebase/firestore';
import {db} from '../firebase';
import {UserData} from '../types';
import {useDocumentData} from 'react-firebase-hooks/firestore';

export const GetUserData$ = (uid: string): {user: UserData; loading: boolean; error: FirestoreError} => {
  const userDocRef = doc(db, `users/${uid}`) as DocumentReference<UserData>;
  const [user, loading, error] = useDocumentData<UserData>(userDocRef);
  return {user, loading, error};
};
