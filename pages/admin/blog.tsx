import {EditorState} from 'draft-js';
import React from 'react';
import TextEditor from '../../components/textEditor/TextEditor';

export default function BlogPage({}) {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

  return (
    <div className="h-screen flex-1 flex-col justify-items-center p-0.5 align-middle md:p-4">
      <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
      <div className="h-3/4">
        <TextEditor editorState={editorState} setEditorState={setEditorState} />
      </div>
    </div>
  );
}
