import {useEffect, useState} from 'react';
import {db} from './firebase';
import {BlogComment, BlogPost, UserData} from './types';
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
  setDoc,
} from 'firebase/firestore';
import {Timestamp} from '@google-cloud/firestore';

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
      const updatedAt: Timestamp = data?.updatedAt as Timestamp;
      const createdAt: Timestamp = data?.createdAt as Timestamp;
      return {
        ...data,
        id: doc.id,
        createdAt: createdAt?.seconds || 0,
        updatedAt: updatedAt?.seconds || 0,
      };
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
  const updatedAt: Timestamp = data?.updatedAt as Timestamp;
  const createdAt: Timestamp = data?.createdAt as Timestamp;
  return {
    ...data,
    id: post.id,
    createdAt: createdAt?.seconds || 0,
    updatedAt: updatedAt?.seconds || 0,
  };
};

export const GetBlogPost$ = (postId: string): BlogPost => {
  const [post, setPost] = useState<BlogPost>();
  const postRef = doc(db, `blogs/${postId}`);

  useEffect(() => {
    const unsubscribe = onSnapshot(postRef, (post) => {
      const data: BlogPost = post.data() as BlogPost;
      const updatedAt: Timestamp = data?.updatedAt as Timestamp;
      const createdAt: Timestamp = data?.createdAt as Timestamp;
      setPost({
        ...data,
        id: post.id,
        createdAt: createdAt?.seconds || 0,
        updatedAt: updatedAt?.seconds || 0,
      });
    });
    return () => unsubscribe();
  }, [postRef]);
  return post;
};

export const addBlogComment = async (blogId: string, comment: BlogComment) => {
  const blogCommentRef = doc(db, `blogs/${blogId}/comments/${comment.author.uid}`);
  await setDoc(blogCommentRef, comment);
};

export const getBlogComments = async (blogId: string) => {
  const blogCommentsRef = collection(db, `blogs/${blogId}/comments`);
  const comments = (await getDocs(blogCommentsRef)).docs.map((doc) => {
    const data = doc.data() as BlogComment;
    const updatedAt: Timestamp = data?.updatedAt as Timestamp;
    const createdAt: Timestamp = data?.createdAt as Timestamp;
    return {
      ...data,
      id: doc.id,
      createdAt: createdAt?.seconds || 0,
      updatedAt: updatedAt?.seconds || 0,
    };
  });

  return comments;
};

export const GetBlogComments$ = (blogId: string) => {
  const [comments, setComments] = useState<BlogComment[]>();
  const blogCommentsRef = collection(db, `blogs/${blogId}/comments`);

  useEffect(() => {
    const unsubscribe = onSnapshot(blogCommentsRef, (post) => {
      const comments: BlogComment[] = [];
      post.docs.map((doc) => {
        const data = doc.data() as BlogComment;
        const updatedAt: Timestamp = data?.updatedAt as Timestamp;
        const createdAt: Timestamp = data?.createdAt as Timestamp;
        comments.push({
          ...data,
          id: doc.id,
          createdAt: createdAt?.seconds || 0,
          updatedAt: updatedAt?.seconds || 0,
        });
      });
      setComments(comments);
    });
    return () => unsubscribe();
  }, [blogCommentsRef]);

  return comments;
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
  const users = (await getDocs(userRef)).docs.map((user) => {
    return {uid: user.id, ...(user.data() as UserData)};
  });
  return users;
};

export const updateUser = async (uid: string, data) => {
  const userRef = doc(db, `users/${uid}`);
  await updateDoc(userRef, data);
};

export const addMail = async (mail) => {
  const mailCollectionRef = collection(db, 'mail');
  await addDoc(mailCollectionRef, mail);
};
