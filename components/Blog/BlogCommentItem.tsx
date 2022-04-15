import {BlogComment, UserData} from '../../lib/types';
import EditorContent from '../textEditor/EditorContent';
import {convertFromRaw, EditorState} from 'draft-js';
import {deleteBlogComment} from '../../lib/FirestoreOperations';
import Modal from '../Modal';
import {Dispatch, SetStateAction, useContext, useState} from 'react';
import {default as dayjs} from 'dayjs';
import {ToastData} from '../toast';
import UserSection from './UserSection';
import VoteSection from './CommentVoteSection';
import {ToastContext} from '../../lib/context';

interface BlogCommentProps {
  comment: BlogComment;
  postId: string;
  user: UserData;
  setShowCommentReplies: Dispatch<SetStateAction<boolean>>;
  setSelectedComment: Dispatch<SetStateAction<BlogComment>>;
  setReplyingToComment: Dispatch<SetStateAction<boolean>>;
}

export default function BlogCommentItem(props: BlogCommentProps) {
  const {setShowToast, setToastData} = useContext(ToastContext);
  const contentState = convertFromRaw(JSON.parse(props.comment.body));
  const editorState = EditorState.createWithContent(contentState);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const editedDate =
    typeof props.comment?.updatedAt === 'number'
      ? dayjs.unix(props.comment.updatedAt).format('MMM DD YYYY')
      : undefined;
  const editedTime =
    typeof props.comment?.updatedAt === 'number' ? dayjs.unix(props.comment.updatedAt).format('HH:mm') : undefined;

  const deleteComment = () => {
    deleteBlogComment(props.postId, props.comment.id).then(() => {
      setToastData({
        type: 'success',
        heading: 'Success',
        body: `Deleted ${props.comment.author.username || props.comment.author.email}'s reply`,
      });
      setOpenConfirmationModal(false);
      setShowToast(true);
    });
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

      <div className="flex-1 flex-col space-y-4">
        <div className="flex flex-col">
          <span className="pr-1">
            <EditorContent editorState={editorState} />
          </span>
          {props.comment.updatedAt > 0 && props.comment.updatedAt !== props.comment.createdAt && (
            <span className="mt-2 p-0 text-xs text-slate-500">
              (Edited {editedDate} at {editedTime})
            </span>
          )}
        </div>
        <div className="flex flex-row pt-4">
          <div className="grid grow grid-rows-2">
            <div className="flex flex-row items-start justify-start space-x-2 self-start text-base text-slate-500 dark:text-slate-400">
              {props.user && (
                <p
                  className="cursor-pointer hover:text-slate-300"
                  onClick={() => {
                    props.setReplyingToComment(true);
                    props.setSelectedComment(props.comment);
                    props.setShowCommentReplies(true);
                  }}
                >
                  reply
                </p>
              )}

              {(props.user?.permissions?.admin || props.user?.permissions?.level > 5) && (
                <p className="cursor-pointer hover:text-slate-400 dark:hover:text-slate-300">flag</p>
              )}

              {props.user?.permissions.admin && (
                <p className="cursor-pointer hover:text-red-500" onClick={async () => setOpenConfirmationModal(true)}>
                  delete
                </p>
              )}
            </div>
            {props.comment.numReplies > 0 && (
              <p
                className="mt-2 cursor-pointer self-end text-slate-500 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300"
                onClick={() => {
                  props.setSelectedComment(props.comment);
                  props.setShowCommentReplies(true);
                }}
              >
                {props.comment.numReplies > 1 ? `View all ${props.comment.numReplies} replies` : `View 1 Reply`}
              </p>
            )}
          </div>
          <div className="gorw-0 mx-0 justify-self-end pr-2 md:mx-2">
            <UserSection {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}
