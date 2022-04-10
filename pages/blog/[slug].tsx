import {ContentState, convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import Metatags from '../../components/Metatags';
import EditorContent from '../../components/textEditor/EditorContent';
import {getBlogComments, GetBlogComments$, GetBlogPost, GetBlogPosts} from '../../lib/FirestoreOperations';
import {BlogComment, BlogPost, UserData} from '../../lib/types';
import {UserInfo} from '@firebase/auth-types';
import {useState} from 'react';
import {Toast, ToastData} from '../../components/toast';
import CommentsSection from '../../components/Blog/CommentsSection';
import CommentRepliesSection from '../../components/Blog/CommentRepliesSection';

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
  const post = props.post;
  const contentState = convertFromRaw(JSON.parse(post.body));
  const editorState = EditorState.createWithContent(contentState);
  const realtimeComments: BlogComment[] = GetBlogComments$(props.postId);
  const comments = realtimeComments || props.comments;
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastData, setToastData] = useState<ToastData>();
  const [showCommentReplies, setShowCommentReplies] = useState(false);
  const [selectedComment, setSelectedComment] = useState<BlogComment>();
  const [isReplyingToComment, setReplyingToComment] = useState(false);

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
      <div className="relative overflow-hidden px-3 pt-10 pb-4 font-roboto font-normal text-slate-800 dark:bg-gray-800 dark:text-slate-200 md:px-6 lg:px-6 xl:px-8">
        <div className="flex flex-col space-y-4 divide-y divide-slate-900 dark:divide-slate-200">
          <div className="m-0 mx-auto max-w-prose text-lg ">
            <EditorContent editorState={editorState} />
          </div>
          {showCommentReplies ? (
            <CommentRepliesSection
              setShowCommentReplies={setShowCommentReplies}
              comment={comments.filter((comment) => comment.id === selectedComment.id)[0]}
              postId={props.postId}
              toast={{setShowToast, setToastData}}
              user={props.userProps.user}
              userData={props.userProps.userData}
              showReplyEditor={isReplyingToComment}
              setReplyingToComment={setReplyingToComment}
            />
          ) : (
            <CommentsSection
              setShowCommentReplies={setShowCommentReplies}
              setSelectedComment={setSelectedComment}
              comments={comments}
              postId={props.postId}
              user={props.userProps.user}
              userData={props.userProps.userData}
              toast={{setShowToast, setToastData}}
              setReplyingToComment={setReplyingToComment}
            />
          )}
        </div>
      </div>
    </main>
  );
}
