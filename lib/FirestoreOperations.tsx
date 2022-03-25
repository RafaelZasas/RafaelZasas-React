import {useEffect, useState} from 'react';
import {db} from './firebase';
import {BlogPost, UserData} from './types';
import {
  collection,
  where,
  getDocs,
  query,
  limit,
  orderBy,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

export const GetTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const tagsRef = collection(db, 'tags');
    const unsubscribe = onSnapshot(tagsRef, (res) => {
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
  const blogRef = collection(db, 'blogs');
  addDoc(blogRef, data);
};

export const GetBlogPosts = async () => {
  const postRef = query(collection(db, 'blogs'), limit(20), orderBy('createdAt', 'desc'));
  try {
    const posts = (await getDocs(postRef)).docs.map((doc) => {
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
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const GetBlogPost = async (postId: string) => {
  const postRef = doc(db, `blogs/${postId}`);
  const post = await getDoc(postRef);
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

export const GetAllUsers = async (): Promise<UserData[]> => {
  const usersRef = collection(db, 'users');
  const users = (await getDocs(usersRef)).docs.map((user) => user.data() as UserData);
  return users;
};

export const getUser = async (uid: string): Promise<UserData> => {
  const userRef = doc(db, `users/${uid}`);
  const user = await getDoc(userRef);
  return {uid: user.id, ...(user.data() as UserData)};
};

export const getUsersByField = async (field: string, fieldValue: string): Promise<UserData[]> => {
  const userRef = query(collection(db, `users`), where(field, '==', fieldValue), limit(1));
  const user = (await getDocs(userRef)).docs.map((user) => {
    return {uid: user.id, ...(user.data() as UserData)};
  });
  return user;
};

export const updateUser = async (uid: string, data) => {
  const userRef = doc(db, `users/${uid}`);
  await updateDoc(userRef, data);
};

export const addMail = async (mail) => {
  const mailCollectionRef = collection(db, 'mail');
  await addDoc(mailCollectionRef, mail);
};
