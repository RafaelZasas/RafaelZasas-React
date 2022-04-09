import dayjs from 'dayjs';
import {convertFromRaw, EditorState} from 'draft-js';
import {Dispatch, SetStateAction, useState} from 'react';
import {deleteBlogComment} from '../../lib/FirestoreOperations';
import {BlogCommentReply, UserData} from '../../lib/types';
import Modal from '../Modal';
import EditorContent from '../textEditor/EditorContent';
import {ToastData} from '../toast';
import UserSection from './UserSection';

interface BlogCommentProps {
  reply: BlogCommentReply;
  postId: string;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
}

export default function CommentReplyItem(props: BlogCommentProps) {
  const contentState = convertFromRaw(JSON.parse(props.reply.body));
  const editorState = EditorState.createWithContent(contentState);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const editedDate =
    typeof props.reply?.updatedAt === 'number' ? dayjs.unix(props.reply.updatedAt).format('MMM DD YYYY') : 'Error';
  const editedTime =
    typeof props.reply?.updatedAt === 'number' ? dayjs.unix(props.reply.updatedAt).format('HH:mm') : 'Error';

  // todo: replace with deleteReply()
  const deleteComment = () => {
    deleteBlogComment(props.postId, props.reply.id)
      .then
      // todo: show toast maybe??
      ();
  };
  return (
    <div className="mr-1 flex flex-row space-x-3 py-4 md:space-x-2">
      <Modal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        header={'Delete Reply'}
        confirmFunction={deleteComment}
        body={`Are you sure you want to delete ${props.user?.username}'s reply?`}
      />

      <div className="flex-1 flex-col space-y-4">
        <div className="flex flex-col">
          <span className="pr-1">
            <EditorContent editorState={editorState} />
          </span>
          {/* TODO: allow users to edit ther replies */}
          {/* {props.reply.updatedAt && props.reply.updatedAt !== props.reply.createdAt && (
            <span className="mt-2 p-0 text-xs text-slate-500">
              (Edited {editedDate} at {editedTime})
            </span>
          )} */}
        </div>
        <div className="grid grid-cols-2 pt-4">
          <div className="flex flex-row items-end justify-start space-x-2 self-end text-base text-slate-500 dark:text-slate-400">
            {(props.user?.permissions?.admin || props.user?.permissions?.level > 5) && (
              <p className="cursor-pointer hover:text-slate-300">flag</p>
            )}

            {props.user?.permissions.admin && (
              <p className="cursor-pointer hover:text-red-500" onClick={async () => setOpenConfirmationModal(true)}>
                delete
              </p>
            )}
          </div>
          <div className="mx-0 justify-self-end pr-2 md:mx-2">
            <UserSection comment={props.reply} postId={props.postId} toast={props.toast} user={props.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
