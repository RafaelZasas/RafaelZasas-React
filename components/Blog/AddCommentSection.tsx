import {faFeather} from '@fortawesome/free-solid-svg-icons';
import {EditorState, convertFromRaw, convertToRaw, ContentState} from 'draft-js';
import {serverTimestamp} from 'firebase/firestore';
import {Dispatch, SetStateAction, useContext, useState} from 'react';
import {ToastContext} from '../../lib/context';
import {addBlogComment} from '../../lib/FirestoreOperations';
import {UserData, BlogComment} from '../../lib/types';
import Button from '../Button';
import TextEditor from '../textEditor/TextEditor';

interface AddCommentSectionProps {
  setShowCommentEditor: Dispatch<SetStateAction<boolean>>;
  user: UserData;
  blogId: string;
  usersComment: BlogComment;
}

export default function AddCommentSection(props: AddCommentSectionProps) {
  const {setShowToast, setToastData} = useContext(ToastContext);
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (props.usersComment) {
      const contentState = convertFromRaw(JSON.parse(props.usersComment.body));

      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  async function SubmitComment() {
    const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;
    const wordCount = editorState.getCurrentContent().getPlainText('\u0001').trim().split(/\s+/).length;

    if (wordCount >= 10) {
      const comment: Partial<BlogComment> = {
        author: {
          email: props.user.email,
          permissions: {admin: props.user.permissions.admin, level: props.user.permissions.level ?? 0},
          uid: props.user.uid,
          username: props.user.username,
          profilePhoto: props.user.profilePhoto || props.user.photoURL || defaultAvatar,
        },
        id: props.user.uid,
        body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        updatedAt: serverTimestamp(),
        numReplies: props.usersComment?.numReplies || 0,
      };

      if (!props.usersComment) {
        comment.createdAt = serverTimestamp();
      }

      try {
        await addBlogComment(props.blogId, comment);
        props.setShowCommentEditor(false);
        setToastData({
          heading: `Thanks ${props.user.username?.split(' ')[0] ?? props.user.email.split('@')[0]}`,
          body: 'Your thoughts are greatly apprecated',
          type: 'success',
        });

        setShowToast(true);

        setEditorState(EditorState.push(editorState, ContentState.createFromText(''), 'remove-range'));
      } catch (error) {
        console.log(error);
        setToastData({
          heading: `Error`,
          body: error,
          type: 'error',
        });

        setShowToast(true);
      }
    } else {
      setToastData({
        heading: 'Comment is too short',
        body: 'Thoughtful comments should be 10 words at least',
        type: 'error',
      });

      setShowToast(true);
    }
  }

  return (
    <div className="mt-4 h-full flex-1 flex-col">
      <div className="z-0 flex h-3/4 w-full flex-1 flex-row">
        <TextEditor editorState={editorState} setEditorState={setEditorState} placeholder={'Enter comment...'} />
      </div>
      <div className="gird-cols-2 mt-4 grid gap-2 md:grid-cols-2">
        <div className="mx-0 justify-self-stretch md:justify-self-start">
          <Button
            text={props.usersComment ? 'Edit' : 'Post'}
            type="button"
            function={SubmitComment}
            rightIcon={faFeather}
          />
        </div>
        <p
          className="cursor-pointer text-blue-500 hover:text-blue-400 md:justify-self-end"
          onClick={() => props.setShowCommentEditor(false)}
        >
          Cancel
        </p>
      </div>
    </div>
  );
}
