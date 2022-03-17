import {EditorState} from 'draft-js';
import React, {useContext} from 'react';
import Spinner1 from '../../components/loadingSpinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import {UserContext} from '../../lib/context';
import DefaultErrorPage from 'next/error';
import Button from '../../components/Button';

function TitleInput() {
  return (
    <div className="w-full md:w-1/3">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        Title
      </label>
      <div className="mt-1">
        <input
          type="title"
          name="title"
          autoFocus
          id="title"
          className="block h-7 w-full rounded-md border-2 border-gray-300 bg-gray-100/30 p-2  shadow-sm backdrop-blur-xl backdrop-filter sm:text-sm"
          placeholder="My fancy title"
        />
      </div>
    </div>
  );
}

function SummaryInput() {
  return (
    <div className="w-full md:w-1/3">
      <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
        Summary
      </label>
      <div className="mt-1">
        <textarea
          rows={4}
          name="summary"
          id="summary"
          className="block w-full rounded-md border-2 border-gray-300 bg-gray-100/30
          p-2 shadow-sm backdrop-blur-xl backdrop-filter focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          defaultValue={''}
        />
      </div>
    </div>
  );
}

export default function BlogPage({}) {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const {user, userData} = useContext(UserContext);

  if (!userData || !user) {
    return !user ? <DefaultErrorPage statusCode={404} /> : <Spinner1 />;
  } else {
    return !userData?.permissions?.admin ? (
      <DefaultErrorPage statusCode={404} />
    ) : (
      <div className="mx-8 h-max flex-1 flex-col justify-items-center space-y-4 p-0.5 align-middle md:p-4">
        <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
        <div className="my-2 w-full flex-1 flex-row space-y-2">
          <TitleInput />
          <SummaryInput />
        </div>
        <div className="flex h-3/4 w-full flex-row">
          <TextEditor editorState={editorState} setEditorState={setEditorState} />
        </div>
        <div className=" mt-2 flex flex-row justify-start space-x-4">
          <Button text="Publish" type="submit" />
          <Button text="Save Draft" type="button" />
        </div>
      </div>
    );
  }
}
