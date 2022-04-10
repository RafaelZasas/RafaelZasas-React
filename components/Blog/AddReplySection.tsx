import {faReply} from '@fortawesome/free-solid-svg-icons';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {serverTimestamp} from 'firebase/firestore';
import {Dispatch, SetStateAction, useState} from 'react';
import {AddBlogCommentReply} from '../../lib/FirestoreOperations';
import {UserData, BlogComment, BlogCommentReply} from '../../lib/types';
import Button from '../Button';
import TextEditor from '../textEditor/TextEditor';
import {ToastData} from '../toast';

interface AddReplySectionProps {
  setShowReplyEditor: Dispatch<SetStateAction<boolean>>;
  user: UserData;
  toast: {
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastData: Dispatch<SetStateAction<ToastData>>;
  };
  postId: string;
  comment: BlogComment;
}

export default function AddReplySection(props: AddReplySectionProps) {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  async function SubmitReply() {
    const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;
    const wordCount = editorState.getCurrentContent().getPlainText('\u0001').trim().split(/\s+/).length;

    if (wordCount >= 10) {
      const reply: BlogCommentReply = {
        author: {
          email: props.user.email,
          permissions: {admin: props.user.permissions.admin, level: props.user.permissions.level ?? 0},
          uid: props.user.uid,
          username: props.user.username,
          profilePhoto: props.user.profilePhoto || props.user.photoURL || defaultAvatar,
        },
        id: '',
        body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await AddBlogCommentReply(props.postId, props.comment, reply);
        props.setShowReplyEditor(false);
        props.toast.setToastData({
          heading: `Thanks ${props.user.username?.split(' ')[0] ?? props.user.email.split('@')[0]}`,
          body: 'Your engagement is greatly apprecated',
          type: 'success',
        });

        props.toast.setShowToast(true);

        setEditorState(EditorState.push(editorState, ContentState.createFromText(''), 'remove-range'));
      } catch (error) {
        console.log(error);
        props.toast.setToastData({
          heading: `Error`,
          body: error,
          type: 'error',
        });

        props.toast.setShowToast(true);
      }
    } else {
      props.toast.setToastData({
        heading: 'Reply is too short',
        body: 'Informative replies should be 10 words or more.',
        type: 'error',
      });

      props.toast.setShowToast(true);
    }
  }

  return (
    <div className="mt-4 h-full flex-1 flex-col">
      <div className="z-0 flex h-3/4 w-full flex-1 flex-row">
        <TextEditor editorState={editorState} setEditorState={setEditorState} placeholder={'Enter reply...'} />
      </div>
      <div className="gird-cols-2 mt-4 grid gap-2 md:grid-cols-2">
        <div className="mx-0 justify-self-stretch md:justify-self-start">
          <Button text="Reply" type="button" function={SubmitReply} rightIcon={faReply} />
        </div>
        <p
          className="cursor-pointer text-blue-500 hover:text-blue-400 md:justify-self-end"
          onClick={() => props.setShowReplyEditor(false)}
        >
          Cancel
        </p>
      </div>
    </div>
  );
}
