import {BlogComment, UserData} from '../lib/types';
import Link from 'next/link';
import CustomImage from './Image';
import EditorContent from './textEditor/EditorContent';
import {convertFromRaw, EditorState} from 'draft-js';
import {addBlogCommentVote, deleteBlogComment} from '../lib/FirestoreOperations';
import Modal from './Modal';
import {useState} from 'react';
import {default as dayjs} from 'dayjs';

const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;

const UpVoteIcon = (props: VoteSectionProps) => {
  const userHasUpvoted = props.comment?.upVotes?.filter((vote) => vote === props.userId).length ?? false;

  return (
    <div
      data-tooltip-target="tooltip-default"
      className={` ${
        userHasUpvoted && 'text-blue-500'
      } mx-auto flex cursor-pointer items-center justify-center text-center hover:text-blue-500`}
      // todo: remove blogCommentVote if user has upvoted and clicks the upvote icon
      onClick={() => addBlogCommentVote(props.postId, props.comment.id, props.userId, true)}
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
  const userHasDownvoted = props.comment?.downVotes?.filter((vote) => vote === props.userId).length > 0 ?? false;
  return (
    <div
      className={` ${
        userHasDownvoted && 'text-blue-500'
      } mx-auto flex cursor-pointer items-center justify-center text-center hover:text-blue-500`}
      // todo: remove blogCommentVote if user has downVoted and clicks the downvote icon

      onClick={() => addBlogCommentVote(props.postId, props.comment.id, props.userId, false)}
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

interface VoteSectionProps {
  numVotes: number;
  userId: string;
  postId: string;
  comment: BlogComment;
}

const VoteSection = (props: VoteSectionProps) => {
  return (
    <div className="flex w-10 flex-col items-center justify-start">
      <UpVoteIcon {...props} />
      <div>{props.numVotes}</div>
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

  return <p className="my-0 px-1 text-xs text-slate-500">Reputation: {reputation}</p>;
};

const UserSection = (props: BlogCommentProps) => {
  const author: Partial<UserData> = props.comment.author;
  const comment: BlogComment = props.comment;
  const createdAtDate =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('MMM DD YYYY') : 'Error';
  const createdAtTime =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('HH:mm') : 'Error';
  return (
    <div className="grid grid-cols-1">
      <p className="pb-1 text-xs text-slate-500">
        Replied {createdAtDate} at {createdAtTime}
      </p>
      <div className="flex flex-row">
        <div className="justify-right">
          <CustomImage
            src={author?.profilePhoto || author?.photoURL || defaultAvatar}
            alt={author?.username ?? 'profile photo'}
            width={40}
            height={40}
            className="pointer-events-none object-cover"
          />
        </div>
        <div className="flex flex-col">
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
    <div className="flex flex-col space-y-3 py-2 md:space-y-4">
      <Modal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        header={'Delete Comment'}
        confirmFunction={deleteComment}
        body={`Are you sure you want to delete ${props.user?.username}'s comment?`}
      />

      <div className="flex flex-row space-x-2 ">
        <VoteSection
          numVotes={(props.comment?.upVotes?.length ?? 0) - (props.comment?.downVotes?.length ?? 0)}
          postId={props.postId}
          comment={props.comment}
          userId={props.user?.uid}
        />
        <div className="flex flex-col space-y-2">
          <EditorContent editorState={editorState} />
          {props.comment.updatedAt && props.comment.updatedAt !== props.comment.createdAt && (
            <span className="m-0 p-0 text-xs text-slate-500">
              (Edited {editedDate} at {editedTime})
            </span>
          )}
        </div>
      </div>
      <div className="grid max-h-16 grid-cols-2">
        <div className="mx-2 flex flex-row items-start justify-start space-x-2 text-base text-slate-500">
          {props.user && <p className="cursor-pointer">reply</p>}

          {(props.user?.permissions?.admin || props.user?.permissions?.level > 5) && (
            <p className="cursor-pointer">flag</p>
          )}

          {props.user?.permissions.admin && (
            <p className="cursor-pointer hover:text-red-500" onClick={async () => setOpenConfirmationModal(true)}>
              delete
            </p>
          )}
        </div>
        <div className="mx-2 justify-self-end">
          <UserSection {...props} />
        </div>
      </div>
    </div>
  );
}
