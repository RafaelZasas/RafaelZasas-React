import {EditorState} from 'draft-js';
import React from 'react';
import TextEditor from '../../components/textEditor/TextEditor';

export default function BlogPage({}) {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

  return (
    <div className="flex min-h-screen flex-col justify-items-center p-0.5 align-middle md:p-4">
      <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
      <div className="flex-row">
        <div className="container mx-auto py-2 sm:px-6 lg:px-8">
          <TextEditor editorState={editorState} setEditorState={setEditorState} />
          <div className="overflow-scroll-y container my-4 ">
            {/* <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
