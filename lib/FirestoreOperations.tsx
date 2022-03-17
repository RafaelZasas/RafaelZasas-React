import {useEffect, useState} from 'react';
import {firestore} from './firebase';

export const GetTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const tagsRef = firestore.collection('tags');
    const unsubscribe = tagsRef.onSnapshot((res) => {
      setTags(
        res.docs.map((doc) => {
          return {id: doc.id, ...doc.data()};
        })
      );
    });
    return unsubscribe;
  }, []);
  return tags;
};
