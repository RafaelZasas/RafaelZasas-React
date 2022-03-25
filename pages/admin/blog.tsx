import {ContentState, convertToRaw, EditorState} from 'draft-js';
import React, {FormEvent, useContext, useState} from 'react';
import Spinner1 from '../../components/loadingSpinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import {UserContext} from '../../lib/context';
import DefaultErrorPage from 'next/error';
import Button from '../../components/Button';
import ComboBox from '../../components/ComboBox';
import Tag from '../../components/Tag';
import {GetTags, PostBlog} from '../../lib/FirestoreOperations';
import {BlogPost} from '../../lib/types';
import {serverTimestamp} from 'firebase/firestore';
import {Toast, ToastData} from '../../components/toast';
import Metatags from '../../components/Metatags';

function TitleInput() {
  return (
    <div className="">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        Title
      </label>
      <div className="mt-1">
        <input
          type="title"
          name="title"
          autoFocus
          id="title"
          className="block h-9 w-full rounded-md border-2 border-gray-300 bg-gray-100/30 p-2 shadow-sm
           backdrop-blur-xl backdrop-filter hover:border-blue-400/70 focus:border-blue-500 sm:text-sm"
          placeholder="My fancy title"
        />
      </div>
    </div>
  );
}

function SummaryInput() {
  return (
    <div>
      <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
        Summary
      </label>
      <div className="mt-1">
        <textarea
          rows={4}
          name="summary"
          id="summary"
          className="block w-full rounded-md border-2 border-gray-300 bg-gray-100/30 p-2 shadow-sm
          backdrop-blur-xl backdrop-filter hover:border-blue-400/70 focus:border-blue-500 sm:text-sm"
          defaultValue={''}
        />
      </div>
    </div>
  );
}

export default function BlogPage({}) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const {user, userData} = useContext(UserContext);
  const [selectedTags, setSelectedTags] = useState<BlogPost['tags']>([]);
  const [isDraft, setIsDraft] = useState(true);
  const tags = GetTags();
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<ToastData>();

  function AddTag(tag) {
    if (selectedTags.filter((obj) => obj.id === tag.id).length === 0) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function _removeTag(tag) {
    const res = selectedTags.filter((obj) => obj.id !== tag.id);
    console.log(res);

    setSelectedTags(res);
  }

  function SubmitBlogPost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const title = e.target.title.value;
    // @ts-ignore
    const summary = e.target.summary.value;

    const wordCount = editorState.getCurrentContent().getPlainText('\u0001').trim().split(/\s+/).length;
    const readingTime = (wordCount / 200 + 1).toFixed(0);

    const postData: BlogPost = {
      title,
      summary,
      tags: selectedTags,
      status: isDraft ? 'draft' : 'published',
      body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      createdAt: serverTimestamp(),
      readingTime: `${readingTime} min read`,
    };

    try {
      PostBlog(postData);

      setToastData({
        heading: 'Success',
        body: `Blog was ${isDraft ? 'saved as draft' : 'published'}`,
        type: 'success',
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        // reset the form
        // @ts-ignore
        e.target.reset();
        // reset the editor
        setEditorState(EditorState.push(editorState, ContentState.createFromText(''), 'remove-range'));
      }, 3000);
    } catch (error) {
      setToastData({
        heading: 'Error posting blog',
        body: error.message,
        type: 'error',
      });
      setShowToast(true);
    }

    setIsDraft(true);
  }

  if (!userData || !user) {
    return !user ? <DefaultErrorPage statusCode={404} /> : <Spinner1 />;
  } else {
    return !userData?.permissions?.admin ? (
      <DefaultErrorPage statusCode={404} />
    ) : (
      <main>
        <Metatags
          title="Admin Blog Management"
          description="Shhh. This page is a secret"
          currentURL="rafaelzasas.com/admin/blog"
        />
        <Toast setShow={setShowToast} toastData={toastData} show={showToast} />
        <form
          className="mx-2 h-max flex-1 flex-col justify-items-center space-y-4 p-0.5 align-middle md:mx-9 md:p-4"
          onSubmit={SubmitBlogPost}
        >
          <h2 className="text-center text-lg font-semibold">Add Blog Entry</h2>
          <div className="z-10 my-2 w-full flex-1 flex-row space-y-2 md:w-1/2">
            <TitleInput />
            <SummaryInput />
            <div className="flex flex-col">
              <ComboBox items={tags} label={'Tags'} function={AddTag} />
              <div className="my-3 flex flex-wrap space-x-2 md:flex-row">
                {selectedTags.length > 0 &&
                  selectedTags.map((tag, index) => {
                    return <Tag tag={tag} key={index} function={_removeTag} />;
                  })}
              </div>
            </div>
          </div>
          <div className="z-0 flex h-3/4 w-full flex-1 flex-row">
            <TextEditor editorState={editorState} setEditorState={setEditorState} />
          </div>
          <div className=" mt-2 flex flex-row justify-start space-x-4">
            <Button text="Publish" type="submit" function={() => setIsDraft(false)} />
            <Button text="Save Draft" type="submit" />
          </div>
        </form>
      </main>
    );
  }
}
