import {BlogComment, UserData} from '../lib/types';
import Link from 'next/link';
import CustomImage from './Image';
import EditorContent from './textEditor/EditorContent';
import {convertFromRaw, EditorState} from 'draft-js';
import {addBlogCommentVote, deleteBlogComment, removeBlogComentVote} from '../lib/FirestoreOperations';
import Modal from './Modal';
import {Dispatch, SetStateAction, useState} from 'react';
import {default as dayjs} from 'dayjs';
import {ToastData} from './toast';

const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;
const errorHeadings = ['Whoops', 'Uh Oh', 'Oh Shucks', 'Yikes', 'Problemo'];

const VoteOnComment = (
  postId: string,
  commentId: string,
  user: Partial<UserData>,
  isUpvote: boolean,
  userHasDownvoted: boolean,
  userHasUpvoted: boolean,
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  }
) => {
  if (user) {
    if (userHasDownvoted || userHasUpvoted) {
      removeBlogComentVote(postId, commentId, user.uid);
    } else {
      addBlogCommentVote(postId, commentId, user.uid, isUpvote);
    }
  } else {
    toast.setToastData({
      heading: errorHeadings[Math.ceil(Math.random() * 5)],
      body: 'You need to log in to vote on comments',
      type: 'error',
    });
    toast.setShowToast(true);
    setTimeout(() => {
      toast.setShowToast(false);
    }, 3000);
  }
};

const UpVoteIcon = (props: BlogCommentProps) => {
  const userHasUpvoted = props.comment?.upVotes?.filter((vote) => vote === props.user?.uid).length ?? false;

  return (
    <div
      data-tooltip-target="tooltip-default"
      className={` ${
        userHasUpvoted && 'text-blue-500'
      } mx-auto flex cursor-pointer items-center justify-center text-center hover:text-blue-500`}
      // todo: remove blogCommentVote if user has upvoted and clicks the upvote icon
      onClick={() =>
        VoteOnComment(props.postId, props.comment.id, props.user, true, !!userHasUpvoted, false, props.toast)
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="currentColor">
        <path
          d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156
            9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333
            274.5 9.39 265.4z"
        />
      </svg>
    </div>
  );
};

const DownVoteIcon = (props: BlogCommentProps) => {
  const userHasDownvoted = props.comment?.downVotes?.filter((vote) => vote === props.user?.uid).length > 0 ?? false;
  return (
    <div
      className={` ${
        userHasDownvoted && 'text-blue-500'
      } mx-auto flex cursor-pointer items-center justify-center text-center hover:text-blue-500`}
      // todo: remove blogCommentVote if user has downVoted and clicks the downvote icon

      onClick={() =>
        VoteOnComment(props.postId, props.comment.id, props.user, false, false, !!userHasDownvoted, props.toast)
      }
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="currentColor">
        <path
          d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244
             237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
        />
      </svg>
    </div>
  );
};

const VoteSection = (props: BlogCommentProps) => {
  const numVotes = (props.comment?.upVotes?.length ?? 0) - (props.comment?.downVotes?.length ?? 0);
  return (
    <div className="flex w-10 flex-col items-center justify-start">
      <UpVoteIcon {...props} />
      <div>{numVotes}</div>
      <DownVoteIcon {...props} />
    </div>
  );
};

const ReputationSection = (props: {user: Partial<UserData>}) => {
  let reputation = '';
  if (props.user?.permissions?.admin) {
    reputation = 'admin';
  } else {
    reputation = `${props.user?.permissions?.level || 0}`;
  }

  return <p className="mb-0 px-1 text-xs text-slate-500 dark:text-slate-300">Reputation: {reputation}</p>;
};

const UserSection = (props: BlogCommentProps) => {
  const author: Partial<UserData> = props.comment.author;
  const comment: BlogComment = props.comment;
  const createdAtDate =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('MMM DD YYYY') : 'Error';
  const createdAtTime =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('HH:mm') : 'Error';

  return (
    <div className="grid grid-cols-1 rounded-sm bg-blue-500/20 p-2 dark:bg-sky-200/20">
      <p className="pb-1 text-xs text-slate-500 dark:text-slate-300">
        Replied {createdAtDate} at {createdAtTime}
      </p>
      <div className="justify-right flex flex-row">
        <CustomImage
          src={author?.profilePhoto || author?.photoURL || defaultAvatar}
          alt={author?.username ?? 'profile photo'}
          width={40}
          height={40}
          className="pointer-events-none object-cover"
        />
        <div className="flex-1 flex-col">
          {/* Username Section */}
          <Link passHref href={`/users/${props.user?.uid}`}>
            <a className="my-0 cursor-pointer self-start px-1 pb-0 pt-0.5 text-sm text-blue-500 visited:text-purple-500 hover:text-blue-400">
              {author?.username ?? author?.email.split('@')[0]}
            </a>
          </Link>

          {/* Reputation Section */}
          <ReputationSection user={author} />
        </div>
      </div>
    </div>
  );
};

interface BlogCommentProps {
  comment: BlogComment;
  postId: string;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
}

export default function BlogCommentItem(props: BlogCommentProps) {
  const contentState = convertFromRaw(JSON.parse(props.comment.body));
  const editorState = EditorState.createWithContent(contentState);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const editedDate =
    typeof props.comment?.updatedAt === 'number' ? dayjs.unix(props.comment.updatedAt).format('MMM DD YYYY') : 'Error';
  const editedTime =
    typeof props.comment?.updatedAt === 'number' ? dayjs.unix(props.comment.updatedAt).format('HH:mm') : 'Error';

  const deleteComment = () => {
    deleteBlogComment(props.postId, props.comment.id)
      .then
      // todo: show toast maybe??
      ();
  };
  return (
    <div className="mr-1 flex flex-row space-x-3 py-4 md:space-x-2">
      <Modal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        header={'Delete Comment'}
        confirmFunction={deleteComment}
        body={`Are you sure you want to delete ${props.user?.username}'s comment?`}
      />
      <VoteSection {...props} />

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <span className="pr-1">
            <EditorContent editorState={editorState} />
          </span>
          {props.comment.updatedAt && props.comment.updatedAt !== props.comment.createdAt && (
            <span className="mt-2 p-0 text-xs text-slate-500">
              (Edited {editedDate} at {editedTime})
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 pt-4">
          <div className="grid grid-rows-2">
            <div className="flex flex-row items-start justify-start space-x-2 self-start text-base text-slate-500 dark:text-slate-400">
              {props.user && <p className="cursor-pointer hover:text-slate-300">reply</p>}

              {(props.user?.permissions?.admin || props.user?.permissions?.level > 5) && (
                <p className="cursor-pointer hover:text-slate-300">flag</p>
              )}

              {props.user?.permissions.admin && (
                <p className="cursor-pointer hover:text-red-500" onClick={async () => setOpenConfirmationModal(true)}>
                  delete
                </p>
              )}
            </div>
            {props.comment.numReplies > 0 && (
              <p className="mt-2 cursor-pointer self-end text-slate-500 hover:text-slate-300 dark:text-slate-400">
                {props.comment.numReplies > 1 ? `View all ${props.comment.numReplies} replies` : `View 1 Reply`}
              </p>
            )}
          </div>
          <div className="mx-0 justify-self-end md:mx-2">
            <UserSection {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}
