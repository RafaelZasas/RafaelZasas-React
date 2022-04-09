import {UserInfo} from 'firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {removeBlogComentVote, addBlogCommentVote} from '../../lib/FirestoreOperations';
import {BlogComment, UserData} from '../../lib/types';
import {ToastData} from '../toast';

const errorHeadings = ['Whoops', 'Uh Oh', 'Oh Shucks', 'Yikes', 'Problemo', 'Thing is...'];

interface VoteSectionProps {
  comment: BlogComment;
  postId: string;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
}

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
    }, 5000);
  }
};

const UpVoteIcon = (props: VoteSectionProps) => {
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

const DownVoteIcon = (props: VoteSectionProps) => {
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

export default function VoteSection(props: VoteSectionProps) {
  const numVotes = (props.comment?.upVotes?.length ?? 0) - (props.comment?.downVotes?.length ?? 0);
  return (
    <div className="flex w-10 flex-col items-center justify-start">
      <UpVoteIcon {...props} />
      <div>{numVotes}</div>
      <DownVoteIcon {...props} />
    </div>
  );
}
