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

export const GetBlogPosts = async () => {
  const postsRef = firestore.collection('blogs').limit(20).orderBy('createdAt', 'desc');
  const posts = (await postsRef.get()).docs.map((doc) => {
    const data: BlogPost = doc.data() as BlogPost;
    if ('seconds' in data.createdAt) {
      return {
        ...data,
        id: doc.id,
        createdAt: data?.createdAt?.seconds || 0,
        updatedAt: data?.updatedAt?.seconds || 0,
      };
    }
  });
  return posts;
};

export const GetBlogPost = async (postId: string) => {
  const postRef = firestore.collection('blogs').doc(postId);
  const post = await postRef.get();
  const data: BlogPost = post.data() as BlogPost;

  if (post.exists && 'seconds' in data.createdAt) {
    return {
      ...data,
      id: post.id,
      createdAt: data?.createdAt?.seconds || 0,
      updatedAt: data?.updatedAt?.seconds || 0,
    };
  } else {
    return null;
  }
};
