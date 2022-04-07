import {useEffect, useState} from 'react';
import {db} from './firebase';
import {BlogComment, BlogPost, BlogTag, UserData} from './types';
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
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import {Timestamp} from '@google-cloud/firestore';

/**
 * Retrieve all the tags in the database for adding to blog posts or announcements.
 * @returns {BlogTag[]} List of Blog Tags
 */
export const GetTags = (): BlogTag[] => {
  const [tags, setTags] = useState<BlogTag[]>([]);

  useEffect(() => {
    const tagsRef = collection(db, 'tags');
    const unsubscribe = onSnapshot(tagsRef, (res) => {
      setTags(
        res.docs.map((doc) => {
          return {id: doc.id, ...(doc.data() as BlogTag)};
        })
      );
    });
    return unsubscribe;
  }, []);
  return tags;
};

/**
 * Add A blog to the blogs collection.
 * @param {BlogPost} data
 */
export const PostBlog = (data: BlogPost) => {
  const blogRef = collection(db, 'blogs');
  addDoc(blogRef, data);
};

/**
 * Retrieve all the blog posts once.
 * Serializes the createdAt and updatedAt timestamps to seconds to allow for JSON parsing.
 * @returns {BlogPost[]} A list of Blog posts with timestamps serialized to seconds (number).
 */
export const GetBlogPosts = async (): Promise<BlogPost[]> => {
  const postRef = query(collection(db, 'blogs'), limit(20), orderBy('createdAt', 'desc'));
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
};

/**
 * Retrieves a single blog post once with timestamps serialized to seconds (number).
 * @param {string} postId The document ID of the blog post
 * @returns {Promise<BlogPost>} Async result of a Blog Post
 */
export const GetBlogPost = async (postId: string): Promise<BlogPost> => {
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

/**
 * Retrieves an observable blog post item with timestamps serialized to seconds (number).
 * @param {string} postId The document ID of the blog post
 * @returns {BlogPost} Async result of a Blog Post
 */
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

/**
 * Adds a blog comment without the created at time if it's an edit or replies.
 * Merges the data if it exists.
 * @param {string} postId Document Id of the blog post
 * @param {Partial<BlogComment>} comment The comment with all fields except createdAt if it's an edit operation.
 */
export const addBlogComment = async (postId: string, comment: Partial<BlogComment>) => {
  const blogCommentRef = doc(db, `blogs/${postId}/comments/${comment.author.uid}`);
  await setDoc(blogCommentRef, comment, {merge: true});
};

/**
 * Append the user's ID to the up/downVotes list within a comment document.
 * Will remove the ID from upVote if it's a downvote and vice versa.
 * @param postId Document Id of the blog post
 * @param commentId document Id of the comment that is being voted on
 * @param userId Auth token Id of the user submitting the vote
 * @param isUpvote
 */
export const addBlogCommentVote = (postId: string, commentId: string, userId: string, isUpvote: boolean) => {
  const blogCommentVotesRef = doc(db, `blogs/${postId}/comments/${commentId}`);
  const data = isUpvote
    ? {
        upVotes: arrayUnion(userId),
        downVotes: arrayRemove(userId),
      }
    : {
        downVotes: arrayUnion(userId),
        upVotes: arrayRemove(userId),
      };
  updateDoc(blogCommentVotesRef, data);
};

/**
 * Removes a users vote from a comment (Up or Down votes)
 * @param postId Document Id of the blog post
 * @param commentId Document Id a comment on the post (UID of the comment author)
 * @param userId UID of the user who is removing their commment vote
 */
export const removeBlogComentVote = (postId: string, commentId: string, userId: string) => {
  const blogCommentVotesRef = doc(db, `blogs/${postId}/comments/${commentId}`);
  const data = {
    downVotes: arrayRemove(userId),
    upVotes: arrayRemove(userId),
  };
  updateDoc(blogCommentVotesRef, data);
};

/**
 * Retrieves all the comments on a blog post.
 * @param postId Document Id of the blog post.
 * @returns {Promise<BlogComment[]>} List of Blog Comments
 */
export const getBlogComments = async (postId: string): Promise<BlogComment[]> => {
  const blogCommentsRef = collection(db, `blogs/${postId}/comments`);
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

/**
 * Retrieve a snapshot listener for all the comments on a blog post.
 * @param postId Document Id of the Blog Post which the comments belong to
 * @returns List of Blog Comments as a snapshot listener.
 */
export const GetBlogComments$ = (postId: string): BlogComment[] => {
  const [comments, setComments] = useState<BlogComment[]>();
  const blogCommentsRef = collection(db, `blogs/${postId}/comments`);

  useEffect(() => {
    let isCancelled = false;

    const unsubscribe = onSnapshot(blogCommentsRef, async (post) => {
      const comments = [];
      if (!isCancelled) {
        post.docs.map(async (doc) => {
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
      }
    });

    return () => {
      unsubscribe();
      isCancelled = true;
    };
  }, []);

  return comments;
};

/**
 * Deletes a users comment from the db.
 * @param postId
 * @param commentId
 */
export const deleteBlogComment = async (postId: string, commentId: string) => {
  const commentRef = doc(db, `blogs/${postId}/comments/${commentId}`);
  await deleteDoc(commentRef);
};

/**
 * Retrieves all the users from the db.
 * @returns A promise of list of users.
 */
export const GetAllUsers = async (): Promise<UserData[]> => {
  const usersRef = collection(db, 'users');
  const users = (await getDocs(usersRef)).docs.map((user) => user.data() as UserData);
  return users;
};

/**
 * Retrieves a single user data instance.
 * @param uid Users auth token/document ID.
 * @returns Promise of a single user object.
 */
export const getUser = async (uid: string): Promise<UserData> => {
  const userRef = doc(db, `users/${uid}`);
  const user = await getDoc(userRef);
  return {uid: user.id, ...(user.data() as UserData)};
};

/**
 * Retrieve a list of users from the databse filtered by a field.
 * @param field The field on the document that is being compares.
 * @param fieldValue The field which is being used to filter.
 * @returns Promise of list of users objects.
 */
export const getUsersByField = async (field: string, fieldValue: string): Promise<UserData[]> => {
  const userRef = query(collection(db, `users`), where(field, '==', fieldValue), limit(1));
  const users = (await getDocs(userRef)).docs.map((user) => {
    return {uid: user.id, ...(user.data() as UserData)};
  });
  return users;
};

/**
 * Updates a user document
 * @param uid The users auth token/document Id
 * @param data The object of fields that are being updated on the users data
 */
export const updateUser = async (uid: string, data: Partial<UserData>) => {
  const userRef = doc(db, `users/${uid}`);
  await updateDoc(userRef, data);
};

/**
 * Adds a mail document to the mail collection to queue for sending.
 * @param mail
 */
export const addMail = async (mail) => {
  const mailCollectionRef = collection(db, 'mail');
  await addDoc(mailCollectionRef, mail);
};
