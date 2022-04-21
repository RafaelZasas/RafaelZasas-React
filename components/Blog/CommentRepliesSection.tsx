import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {UserInfo} from 'firebase/auth';
import Link from 'next/link';
import {Dispatch, SetStateAction, useState} from 'react';
import {GetBlogCommentReplies$} from '../../lib/FirestoreOperations';
import {BlogComment, BlogCommentReply, UserData} from '../../lib/types';
import Spinner1 from '../loadingSpinners/Spinner1';
import AddReplySection from './AddReplySection';
import CommentReplyItem from './CommentReplyItem';
import PrimaryComment from './PrimaryComment';

interface CommentRepliesSectionProps {
  setShowCommentReplies: Dispatch<SetStateAction<boolean>>;
  postId: string;
  comment: BlogComment;
  user: UserInfo;
  userData: UserData;
  showReplyEditor?: boolean;
  setReplyingToComment: Dispatch<SetStateAction<boolean>>;
}

export default function CommentRepliesSection(props: CommentRepliesSectionProps) {
  const replies: BlogCommentReply[] = GetBlogCommentReplies$(props.postId, props.comment.id);
  const [showReplyEditor, setShowReplyEditor] = useState<boolean>(props?.showReplyEditor || false);
  return (
    <div className="mx-auto w-full max-w-none flex-1 flex-col md:w-full lg:w-1/2">
      <div className="my-2 grid grid-cols-2">
        <p
          className="cursor-pointer justify-self-start hover:text-blue-500"
          onClick={() => {
            props.setReplyingToComment(false);
            props.setShowCommentReplies(false);
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className={'mr-2'} />
          Comments
        </p>
        {/* <p className="mr-2 justify-self-end">Order by</p> */}
      </div>
      {!replies ? (
        <Spinner1 />
      ) : (
        <div className="flex flex-col space-y-4 divide-y-2 divide-slate-400 transition delay-150 duration-150 ease-in-out dark:divide-slate-100">
          <div>
            <p className="my-2 font-semibold">
              {props.comment.author.username || props.comment.author.email}&apos;s comment:
            </p>
            <PrimaryComment comment={props.comment} postId={props.postId} user={props.userData} />
          </div>
          <div>
            {!replies.length ? (
              <p className="mt-4">Be the first person to reply</p>
            ) : (
              <>
                <p className="mt-4 font-semibold">Replies:</p>
                <div className="my-2 grid max-h-screen grid-cols-1 divide-y divide-stone-300 overflow-y-scroll md:max-h-[30rem] lg:max-h-[40rem]">
                  {replies.map((reply, index) => {
                    return (
                      <CommentReplyItem
                        comment={props.comment}
                        reply={reply}
                        user={props.userData}
                        key={index}
                        postId={props.postId}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Third row in col - text to add comment or comment editor section */}
      <div className="my-6 flex flex-row md:my-2">
        {!props.user ? (
          <p className="mt-2">
            <span className="cursor-pointer pr-2 text-blue-500 hover:text-blue-400">
              <Link href={'/login'}>Log in</Link>
            </span>
            to reply to comments
          </p>
        ) : (
          !showReplyEditor && (
            <p
              className="mt-2 cursor-pointer text-blue-500 hover:text-blue-400"
              onClick={() => setShowReplyEditor(true)}
            >
              Reply to {props.comment.author.username || props.comment.author.email}&apos;s comment
            </p>
          )
        )}
        {showReplyEditor && (
          <AddReplySection
            user={props.userData}
            comment={props.comment}
            setShowReplyEditor={setShowReplyEditor}
            postId={props.postId}
          />
        )}
      </div>
    </div>
  );
}
