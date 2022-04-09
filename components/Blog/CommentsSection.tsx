import {UserInfo} from 'firebase/auth';
import Link from 'next/link';
import {Dispatch, SetStateAction, useState} from 'react';
import {BlogComment, UserData} from '../../lib/types';
import {ToastData} from '../toast';
import AddCommentSection from './AddCommentSection';
import BlogCommentItem from './BlogCommentItem';

interface CommentSectionProps {
  comments: BlogComment[];
  user: UserInfo;
  userData: UserData;
  postId: string;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
  setShowCommentReplies: Dispatch<SetStateAction<boolean>>;
  setSelectedComment: Dispatch<SetStateAction<BlogComment>>;
  setReplyingToComment: Dispatch<SetStateAction<boolean>>;
}
export default function CommentsSection(props: CommentSectionProps) {
  const comments: BlogComment[] = props.comments;
  const setShowToast: Dispatch<SetStateAction<boolean>> = props.toast.setShowToast;
  const setToastData: Dispatch<SetStateAction<ToastData>> = props.toast.setToastData;
  const usersComment: BlogComment[] = comments.filter((comment) => comment.id === props.user?.uid);
  const [showCommentEditor, setShowCommentEditor] = useState<boolean>(false);

  return (
    <div className="mx-auto w-full max-w-none flex-1 flex-col md:w-full lg:w-1/2">
      {/* First row in column - Comments title and order by menu */}
      <div className="my-2 grid grid-cols-2">
        <p className="justify-self-start">Comments</p>
        {/* <p className="mr-2 justify-self-end">Order by</p> */}
      </div>
      {/* Second row in col - Actual scrollable comments section */}
      {comments && comments?.length > 0 ? (
        <div className="my-2 grid max-h-screen grid-cols-1 divide-y divide-stone-300 overflow-y-scroll md:max-h-[30rem] lg:max-h-[40rem]">
          {comments.map((comment, index) => {
            return (
              <BlogCommentItem
                setShowCommentReplies={props.setShowCommentReplies}
                setSelectedComment={props.setSelectedComment}
                toast={{setShowToast, setToastData}}
                comment={comment}
                user={props.userData}
                key={index}
                postId={props.postId}
                setReplyingToComment={props.setReplyingToComment}
              />
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-slate-500">No comments have been added yet</p>
      )}

      {/* Third row in col - text to add comment or comment editor section */}
      <div className="my-6 flex flex-row md:my-2">
        {!props.user ? (
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
            user={props.userData}
            usersComment={usersComment.length === 0 ? null : usersComment[0]}
            setShowCommentEditor={setShowCommentEditor}
            toast={{setShowToast, setToastData}}
            blogId={props.postId}
          />
        )}
      </div>
    </div>
  );
}
