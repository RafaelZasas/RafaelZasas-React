import {EditorState} from 'draft-js';
import React, {useContext} from 'react';
import Spinner1 from '../../components/loadingSpinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import {UserContext} from '../../lib/context';
import DefaultErrorPage from 'next/error';

export default function BlogPage({}) {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const {userData} = useContext(UserContext);

  if (!userData) {
    return <Spinner1 />;
  } else {
    return !userData?.permissions?.admin ? (
      <DefaultErrorPage statusCode={404} />
    ) : (
      <div className="h-screen flex-1 flex-col justify-items-center p-0.5 align-middle md:p-4">
        <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
        <div className="h-3/4">
          <TextEditor editorState={editorState} setEditorState={setEditorState} />
        </div>
      </div>
    );
  }
}
