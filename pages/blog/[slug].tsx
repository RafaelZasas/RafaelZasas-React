import {ContentState, convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import Metatags from '../../components/Metatags';
import EditorContent from '../../components/textEditor/EditorContent';
import {
  addBlogComment,
  getBlogComments,
  GetBlogComments$,
  GetBlogPost,
  GetBlogPost$,
  GetBlogPosts,
} from '../../lib/FirestoreOperations';
import {BlogComment, BlogPost, UserData} from '../../lib/types';
import {UserInfo} from '@firebase/auth-types';
import TextEditor from '../../components/textEditor/TextEditor';
import {Dispatch, SetStateAction, useState} from 'react';
import Button from '../../components/Button';
import {serverTimestamp} from 'firebase/firestore';
import {faFeather, faReply} from '@fortawesome/free-solid-svg-icons';
import {Toast, ToastData} from '../../components/toast';
import Link from 'next/link';
import BlogCommentItem from '../../components/BlogCommentItem';

export async function getStaticProps({params}) {
  const {slug} = params;

  const post = await GetBlogPost(slug);
  const comments = await getBlogComments(slug);

  const postId = post?.id ?? 'not-found';

  return {
    props: {post, postId, comments},
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const posts = await GetBlogPosts();

  const paths = posts.map((post) => {
    const slug = post.id;
    return {
      params: {slug},
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { slug }}
    // ],
    paths,
    fallback: 'blocking', // This tells next to use regular db calls then cache as opposed to failing
  };
}

interface BlogPostProps {
  postId: string;
  post: BlogPost;
  comments: BlogComment[];
  userProps: {user: UserInfo; userData: UserData};
}

export default function BlogPostPage(props: BlogPostProps) {
  // const realtimePost = GetBlogPost$(props.postId);
  const realtimeComments = GetBlogComments$(props.postId);
  const comments = realtimeComments || props.comments;
  const post = props.post;
  const contentState = convertFromRaw(JSON.parse(post.body));
  const editorState = EditorState.createWithContent(contentState);
  const [showCommentEditor, setShowCommentEditor] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastData, setToastData] = useState<ToastData>();

  const usersComment = comments.filter((comment) => comment.id === props.userProps?.user?.uid);

  return (
    <main>
      <Metatags
        title={props.post.title}
        description={props.post.summary}
        image={
          props.post.displayImage ??
          'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/profile-photo.jpg?alt=media&token=6d133b36-eb83-4bf3-a58d-317bc1eeaf2a'
        }
        currentURL={`rafaelzasas.com/blog/${props.postId}`}
      />
      <Toast setShow={setShowToast} show={showToast} toastData={toastData} />
      <div className="xl-px-8 relative overflow-hidden pt-10 pb-4 font-roboto font-normal text-slate-800 dark:bg-gray-800 dark:text-white md:px-6 lg:px-6">
        <div className="flex flex-col space-y-4 divide-y divide-slate-900">
          <div className="m-0 mx-auto max-w-prose text-lg ">
            <EditorContent editorState={editorState} />
          </div>
          {/* Comment Section */}
          <div className="mx-auto w-full max-w-none flex-1 flex-col md:w-full lg:w-1/2">
            {/* First row in column - Comments title and order by menu */}
            <div className="my-2 grid grid-cols-2">
              <p className="justify-self-start">Comments</p>
              <p className="mr-2 justify-self-end">Order by</p>
            </div>
            {/* Second row in col - Actual scrollable comments section */}
            {comments?.length > 0 && (
              <div className="my-2 grid max-h-screen grid-cols-1 divide-y divide-stone-300 overflow-y-scroll md:max-h-[30rem] lg:max-h-[40rem]">
                {comments.map((comment, index) => {
                  return <BlogCommentItem comment={comment} user={props.userProps.userData} key={index} />;
                })}
              </div>
            )}

            {(!comments || comments?.length === 0) && (
              <p className="mt-6 text-slate-500">No comments have been added yet</p>
            )}
            {/* Third row in col - text to add comment or comment editor section */}
            <div className="my-6 flex flex-row md:my-2">
              {!props.userProps.user ? (
                <p className="mt-2">
                  <span className="cursor-pointer pr-2 text-blue-500 hover:text-blue-400">
                    <Link href={'/login'}>Log in</Link>
                  </span>
                  to post comments
                </p>
              ) : (
                !showCommentEditor && (
                  <p
                    className="mt-2 cursor-pointer text-blue-500 hover:text-blue-400"
                    onClick={() => setShowCommentEditor(true)}
                  >
                    {usersComment?.length === 0 ? 'Add Comment' : 'Edit Comment'}
                  </p>
                )
              )}
              {showCommentEditor && (
                <AddCommentSection
                  user={props.userProps.userData}
                  usersComment={usersComment.length === 0 ? null : usersComment[0]}
                  setShowCommentEditor={setShowCommentEditor}
                  toast={{setShowToast, setToastData}}
                  blogId={props.postId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface AddCommentSectionProps {
  setShowCommentEditor: Dispatch<SetStateAction<boolean>>;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
  blogId: string;
  usersComment: BlogComment;
}

const AddCommentSection = (props: AddCommentSectionProps) => {
  const [editorState, setEditorState] = useState(() => {
    if (props.usersComment) {
      const contentState = convertFromRaw(JSON.parse(props.usersComment.body));

      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  async function SubmitComment() {
    const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;
    const wordCount = editorState.getCurrentContent().getPlainText('\u0001').trim().split(/\s+/).length;

    if (wordCount >= 10) {
      const comment: BlogComment = {
        author: {
          email: props.user.email,
          permissions: {admin: props.user.permissions.admin, level: props.user.permissions.level ?? 0},
          uid: props.user.uid,
          username: props.user.username,
          profilePhoto: props.user.profilePhoto || props.user.photoURL || defaultAvatar,
        },
        id: props.user.uid,
        body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        upVotes: [],
        downVotes: [],
      };

      try {
        await addBlogComment(props.blogId, comment);
        props.setShowCommentEditor(false);
        props.toast.setToastData({
          heading: `Thanks ${props.user.username?.split(' ')[0] ?? props.user.email.split('@')[0]}`,
          body: 'Your thoughts are greatly apprecated',
          type: 'success',
        });

        props.toast.setShowToast(true);
        setTimeout(() => {
          props.toast.setShowToast(false);
        }, 3000);

        setEditorState(EditorState.push(editorState, ContentState.createFromText(''), 'remove-range'));
      } catch (error) {
        console.log(error);
        props.toast.setToastData({
          heading: `Error`,
          body: error,
          type: 'error',
        });

        props.toast.setShowToast(true);
        setTimeout(() => {
          props.toast.setShowToast(false);
        }, 3000);
      }
    } else {
      props.toast.setToastData({
        heading: 'Comment is too short',
        body: 'Thoughtful comments should be 10 words at least',
        type: 'error',
      });

      props.toast.setShowToast(true);
      setTimeout(() => {
        props.toast.setShowToast(false);
      }, 3000);
    }
  }

  return (
    <div className="mt-4 h-full flex-1 flex-col">
      <div className="z-0 flex h-3/4 w-full flex-1 flex-row">
        <TextEditor editorState={editorState} setEditorState={setEditorState} placeholder={'Enter comment...'} />
      </div>
      <div className="gird-cols-2 mt-4 grid gap-2 md:grid-cols-2">
        <div className="mx-0 justify-self-stretch md:justify-self-start">
          <Button
            text={props.usersComment ? 'Edit' : 'Post'}
            type="button"
            function={SubmitComment}
            rightIcon={faFeather}
          />
        </div>
        <p
          className="cursor-pointer text-blue-500 hover:text-blue-400 md:justify-self-end"
          onClick={() => props.setShowCommentEditor(false)}
        >
          Cancel
        </p>
      </div>
    </div>
  );
};
