import {useEffect, useState} from 'react';
import {firestore} from './firebase';
import {BlogPost} from './types';

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

export const PostBlog = (data: BlogPost) => {
  const blogRef = firestore.collection('blogs');
  blogRef.add(data);
};
