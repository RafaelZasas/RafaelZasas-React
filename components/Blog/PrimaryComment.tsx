import EditorContent from '../textEditor/EditorContent';
import VoteSection from './CommentVoteSection';
import UserSection from './UserSection';
import {default as dayjs} from 'dayjs';
import {convertFromRaw, EditorState} from 'draft-js';
import {Dispatch, SetStateAction, useState} from 'react';
import {BlogComment, UserData} from '../../lib/types';
import {ToastData} from '../toast';

interface PrimaryCommentProps {
  comment: BlogComment;
  postId: string;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
}

export default function PrimaryComment(props: PrimaryCommentProps) {
  const contentState = convertFromRaw(JSON.parse(props.comment.body));
  const editorState = EditorState.createWithContent(contentState);
  const editedDate =
    typeof props.comment?.updatedAt === 'number' ? dayjs.unix(props.comment.updatedAt).format('MMM DD YYYY') : 'Error';
  const editedTime =
    typeof props.comment?.updatedAt === 'number' ? dayjs.unix(props.comment.updatedAt).format('HH:mm') : 'Error';

  return (
    <div className="mr-1 flex flex-row space-x-3 rounded-md bg-white/40 bg-clip-padding py-4 backdrop-blur-xl backdrop-filter dark:bg-blue-400/10 md:space-x-2">
      <VoteSection {...props} />

      <div className="flex-1 flex-col space-y-4">
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
        <div className="flex flex-row pt-4">
          <div className="grid grow grid-rows-2">
            <div className="flex flex-row items-start justify-start space-x-2 self-start text-base text-slate-500 dark:text-slate-400">
              {(props.user?.permissions?.admin || props.user?.permissions?.level > 5) && (
                <p className="cursor-pointer hover:text-slate-300">flag</p>
              )}
            </div>
          </div>
          <div className="mx-0 grow-0 justify-self-end pr-2 md:mx-2">
            <UserSection {...props} primary={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
