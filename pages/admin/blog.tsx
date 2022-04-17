import {ContentState, convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import React, {Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState} from 'react';
import Spinner1 from '../../components/loadingSpinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import {ToastContext, UserContext} from '../../lib/context';
import DefaultErrorPage from 'next/error';
import Button from '../../components/Button';
import ComboBox from '../../components/ComboBox';
import Tag from '../../components/Tag';
import {GetTags, PostBlog, updateBlogPost} from '../../lib/FirestoreOperations';
import {BlogPost, BlogTag} from '../../lib/types';
import {serverTimestamp} from 'firebase/firestore';
import Metatags from '../../components/Metatags';
import CustomImage from '../../components/Image';
import FileInputButton from '../../components/FileInputButton';
import {uploadImage} from '../../lib/CloudStorageOperations';
import {useRouter} from 'next/router';
import {FileData} from '../../lib/types/component.types';
import {UploadMetadata} from 'firebase/storage';

function TitleInput(props: {editablePost: BlogPost | undefined}) {
  return (
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-200">
        Title
      </label>
      <div className="mt-1">
        <input
          type="title"
          name="title"
          defaultValue={props.editablePost?.title || ''}
          maxLength={60}
          autoFocus
          id="title"
          className="block h-9 w-full rounded-md border-2 border-gray-300 bg-gray-100/30 p-2 shadow-sm backdrop-blur-xl backdrop-filter hover:border-blue-400/70
           focus:border-blue-500 dark:border-slate-500 dark:bg-black/30 dark:text-white sm:text-sm"
          placeholder="My fancy title"
        />
      </div>
    </div>
  );
}

function SummaryInput(props: {editablePost: BlogPost | undefined}) {
  return (
    <div>
      <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-slate-200">
        Summary
      </label>
      <div className="mt-1">
        <textarea
          rows={4}
          name="summary"
          maxLength={160}
          id="summary"
          className="block w-full rounded-md border-2 border-gray-300 bg-gray-100/30 p-2 shadow-sm
          backdrop-blur-xl backdrop-filter hover:border-blue-400/70 focus:border-blue-500 dark:border-slate-500 dark:bg-black/30 dark:text-white sm:text-sm"
          defaultValue={props.editablePost?.summary || ''}
        />
      </div>
    </div>
  );
}

interface ImageInputProps {
  imageData: FileData;
  setImageData: Dispatch<SetStateAction<FileData>>;
}

function ImageInput(props: ImageInputProps) {
  const [imageIsLoading, setImageLoading] = useState(false);

  function Upload(imageData: FileData) {
    const metadata: UploadMetadata = {
      cacheControl: 'public,max-age=8200',
      contentType: `image/${imageData.type}`,
    };
    uploadImage(`blog/${imageData.name}`, imageData.src, metadata).then((imageUrl) => {
      props.setImageData({...imageData, src: imageUrl});
      setImageLoading(false);
    });
  }

  return (
    <div className="flex flex-col space-y-5">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">Image</label>
      {imageIsLoading && (
        <span className="inline-block h-fit w-fit overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Spinner1 />
        </span>
      )}
      {props.imageData.src !== '' && !imageIsLoading && (
        <span className="inline-block h-fit w-fit overflow-hidden bg-gray-100 dark:bg-gray-800">
          <CustomImage
            src={props.imageData.src}
            alt={props.imageData.name}
            width={'100%'}
            height={'100%'}
            className="h-48 w-full object-cover"
            layout={'intrinsic'}
            objectFit={'contain'}
          />
        </span>
      )}
      <label className="my-2" htmlFor="imageIput">
        <FileInputButton
          type="button"
          text={props.imageData.src !== '' ? 'Edit' : 'Add'}
          buttonStyle="info"
          id={'imageInput'}
          name={'imgageInput'}
          maxFileSizeInKB={1000}
          onUpload={(value: FileData) => Upload(value)}
          allowedExtensions={['jpeg', 'jpeg', 'png']}
          setLoading={setImageLoading}
        />
      </label>
    </div>
  );
}

export default function BlogPage({}) {
  const router = useRouter();
  const {user, userData} = useContext(UserContext);
  const {setShowToast, setToastData} = useContext(ToastContext);
  const editablePost: BlogPost = router.query.post ? JSON.parse(router.query.post as string) : undefined;
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (editablePost) {
      const contentState = convertFromRaw(JSON.parse(editablePost.body));
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });
  const [selectedTags, setSelectedTags] = useState<BlogPost['tags']>(editablePost?.tags || []);
  const [isDraft, setIsDraft] = useState(true);
  const [imageData, setImageData] = useState<FileData>({
    name: '',
    size: '',
    sizeInKB: 0,
    src: editablePost?.displayImage || '',
    type: '',
  });
  const tags = GetTags();

  function AddTag(tag: BlogTag) {
    if (selectedTags.filter((obj) => obj.id === tag.id).length === 0) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function _removeTag(tag: BlogTag) {
    const res = selectedTags.filter((obj) => obj.id !== tag.id);
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
      body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      createdAt: serverTimestamp(),
      readingTime: `${readingTime} min read`,
      status: isDraft ? 'draft' : 'published',
      id: editablePost?.id || '',
      upVotes: [],
      downVotes: [],
    };

    if (imageData.src !== '') {
      postData['displayImage'] = imageData.src;
    }

    try {
      !!editablePost ? updateBlogPost(postData) : PostBlog(postData);

      setToastData({
        heading: 'Success',
        body: `Blog was ${isDraft ? 'saved as draft' : 'published'}`,
        type: 'success',
      });
      setShowToast(true);
      setTimeout(() => {
        // reset the form
        // @ts-ignore
        e.target.reset();
        // reset the editor
        setEditorState(EditorState.push(editorState, ContentState.createFromText(''), 'remove-range'));
        setSelectedTags([]);
        setImageData({
          name: '',
          size: '',
          sizeInKB: 0,
          type: '',
          src: '',
        });
        router.push('/blog');
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
      <main className="dark:bg-gray-800 dark:text-slate-200">
        <Metatags
          title="Admin Blog Management"
          description="Shhh. This page is a secret"
          currentURL="rafaelzasas.com/admin/blog"
        />
        <form
          className="mx-2 h-max flex-1 flex-col justify-items-center space-y-4 p-0.5 align-middle md:mx-9 md:p-4"
          onSubmit={SubmitBlogPost}
        >
          <h2 className="text-center text-lg font-semibold">{editablePost ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
          <div className="z-10 my-2 w-full flex-1 flex-row space-y-2 md:w-1/2">
            <TitleInput editablePost={editablePost} />
            <SummaryInput editablePost={editablePost} />
            <ImageInput imageData={imageData} setImageData={setImageData} />
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
