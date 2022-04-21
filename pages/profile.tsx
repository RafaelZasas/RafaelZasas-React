import {useContext, useEffect, useState, useCallback, Dispatch, SetStateAction} from 'react';
import {ToastContext, UserContext} from '../lib/context';
import {ExclamationCircleIcon} from '@heroicons/react/solid';
import {auth} from '../lib/firebase';
import {useRouter} from 'next/router';
import debounce from 'lodash.debounce';
import Metatags from '../components/Metatags';
import {getUsersByField, updateUser} from '../lib/FirestoreOperations';
import Error from 'next/error';
import {UserInfo} from 'firebase/auth';
import CustomImage from '../components/Image';
import {UploadMetadata} from 'firebase/storage';
import {uploadImage} from '../lib/CloudStorageOperations';
import {FileData} from '../lib/types/component.types';
import FileInputButton from '../components/FileInputButton';
import Spinner1 from '../components/loadingSpinners/Spinner1';
import {UserData} from '../lib/types';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

export default function ProfilePage({}) {
  const {user, userData} = useContext(UserContext);

  return !user ? (
    <Error statusCode={401} title={'Unauthorized'} />
  ) : (
    <div className="mx-auto flex flex-col">
      <Profile user={user} userData={userData} />
    </div>
  );
}

const Profile = (props: {user: UserInfo; userData: UserData}) => {
  const [isValid, setIsValid] = useState(true);
  const {setShowToast, setToastData} = useContext(ToastContext);
  const [imageData, setImageData] = useState<FileData>();
  const router = useRouter();

  const updateProfile = async (e) => {
    e.preventDefault();
    const formData: Partial<UserData> = {
      username: e.target.username.value,
      website: e.target.website.value,
      profilePhoto: imageData?.src || props.userData.profilePhoto,
      bio: e.target.bio.value,
      communications: {
        email: {
          comments: e.target.comments_email.checked,
          projects: e.target.projects_email.checked,
          updates: e.target.updates_email.checked,
        },
        push: {
          comments: e.target.comments_push.checked,
          projects: e.target.projects_push.checked,
          updates: e.target.updates_push.checked,
        },
      },
    };
    try {
      await updateUser(props.user.uid, formData);
      setToastData({
        heading: 'Success!',
        body: 'Your profile and preferences have been saved.',
        type: 'success',
      });
      setShowToast(true);
    } catch (e) {
      console.log(e);
      setToastData({
        heading: 'Error Updating Profile',
        body: e.message,
        type: 'error',
      });
      setShowToast(true);
    }
  };

  return (
    <main>
      <Metatags title="Profile" description="User Profile" currentURL="rafaelzasas.com/profile" />
      <form className="space-y-6 px-5 py-4" onSubmit={updateProfile}>
        {/* Form Inputs */}
        <GlassCard
          className="!rounded-lg px-4 py-5
              shadow-md sm:p-6"
        >
          {/* Heading */}
          <div className="w-full pb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-slate-200">Profile</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
              This information will be displayed in comment sections and your public profile.
            </p>
          </div>

          {/* Personal Info Section */}

          <div className="mt-2 w-full md:gap-6">
            <div className="mt-5 md:mt-0">
              <div className="space-y-6">
                <UsernameInput formValidityState={[isValid, setIsValid]} />

                <WebsiteInput />

                <BioInput />

                <PhotoInput imageData={imageData} setImageData={setImageData} userData={props.userData} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Notifications Section */}
        <GlassCard
          className="!rounded-lg px-4 py-5
              shadow-md sm:p-6 lg:backdrop-blur-md"
        >
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-slate-300">Notifications</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Decide which communications you&apos;d like to receive and how.
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="space-y-6">
                <EmailNotificationsFieldset />
                <PushNotificationsFieldset />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-rows-2 gap-y-6 p-4 md:grid-cols-2 md:p-0.5">
          <div className="space-y-2 md:flex-row md:space-x-2 md:justify-self-start">
            <SaveBtn isValid={isValid} />
            <Button text="Public Profile" function={() => router.push(`users/${props.user.uid}`)} />
          </div>
          <div className="md:justify-self-end">
            <SignOutBtn />
          </div>
        </div>
      </form>
    </main>
  );
};

const UsernameInput = (props) => {
  // validity state passed into component as a property- used in parent to disable submit button
  const [isValid, setIsValid] = props.formValidityState;
  const [loading, setLoading] = useState(false);
  const [usernameValue, setUsernameValue] = useState('hopefullyNobodyUsesThis');
  const {user, userData} = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const usernameClasses = {
    valid: `block w-full pr-10 border-gray-300 bg-gray-100/30 border
     dark:border-slate-800 dark:bg-black/50 dark:text-slate-300 p-2 placeholder-gray-300 dark:placeholder-slate-200
        focus:outline-none focus:border-blue-500 sm:text-sm rounded-md`,
    invalid: `block w-full pr-10 border-red-300 text-red-900 placeholder-red-300
    dark:border-slate-800 border dark:bg-black/50 p-2 placeholder-gray-300 dark:text-red-600
        focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md`,
  };

  const onChange = (e) => {
    setLoading(true);
    setUsernameValue(e.target.value);
  };

  useEffect(() => {
    checkUsername(usernameValue);
  }, [usernameValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length < 3) {
        setLoading(false);
        setIsValid(false);
        setErrorMessage('Username is too short');
      } else if (username.length > 25) {
        setLoading(false);
        setIsValid(false);
        setErrorMessage('Username is too long');
      } else {
        const docs = await getUsersByField('username', username);
        setIsValid(docs.length == 0);
        setLoading(false);
        setErrorMessage(docs.length > 0 ? 'Username is taken. Please choose another' : '');
      }
    }, 500),
    []
  );

  return (
    <div className="w-full flex-1 flex-row md:w-1/3">
      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        Username
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name="username"
          id="username"
          onChange={onChange}
          className={isValid ? usernameClasses.valid : usernameClasses.invalid}
          placeholder={userData?.username || 'username'}
          defaultValue={userData?.username || userData?.email.split('@')[0]}
          aria-invalid="false"
          aria-describedby="username-error"
        />

        {!isValid && !loading && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-red-600" id="username-error">
        {errorMessage}
      </p>
    </div>
  );
};

function WebsiteInput() {
  const {user, userData} = useContext(UserContext);

  return (
    <div className="w-full flex-1 flex-row md:w-1/3">
      <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          Website
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span
            className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50
            px-3 text-sm text-gray-500 dark:border-black dark:bg-black/70 dark:text-slate-500"
          >
            https://
          </span>
          <input
            type="text"
            name="website"
            id="website"
            defaultValue={userData?.website ? userData.website : null}
            className="block w-full flex-1 rounded-none
             rounded-r-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800 dark:bg-black/50 dark:text-slate-300 sm:text-sm"
            placeholder="www.example.com"
          />
        </div>
      </div>
    </div>
  );
}

function BioInput() {
  const {user, userData} = useContext(UserContext);
  return (
    <div className="w-full flex-1 flex-row md:w-1/2">
      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
        Bio
      </label>
      <div className="mt-1">
        <textarea
          id="bio"
          name="bio"
          rows={3}
          className="block w-full rounded-md border
          border-gray-300 p-2 shadow-sm focus:border-blue-500
           focus:ring-blue-500 dark:border-black dark:bg-black/50 dark:text-slate-300 sm:text-sm"
          placeholder="eg. Hi, my name Jeff"
          defaultValue={userData?.bio || ''}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Brief description for your profile.</p>
    </div>
  );
}

function PhotoInput(props: {
  imageData: FileData;
  setImageData: Dispatch<SetStateAction<FileData>>;
  userData: UserData;
}) {
  const defaultProfilePhoto =
    'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/profilePhotos%2Fdefault-avatar.jpg?alt=media&token=f26406ac-4279-49f4-b6fe-385462e56923';
  const {userData} = useContext(UserContext);
  const [imageIsLoading, setImageLoading] = useState(false);

  function Upload(imageData: FileData) {
    const metadata: UploadMetadata = {
      cacheControl: 'public,max-age=8200',
      contentType: `image/${imageData.type}`,
      customMetadata: {
        username: userData.username,
        email: userData.email,
      },
    };
    uploadImage(`profilePhotos/${userData.uid}.${imageData.type}`, imageData.src, metadata).then((imageUrl) => {
      props.setImageData({...imageData, src: imageUrl});
      setImageLoading(false);
    });
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Profile Photo</label>
      <div className="mt-1 flex items-center space-x-5">
        {imageIsLoading ? (
          <Spinner1 />
        ) : (
          <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
            <CustomImage
              src={props.imageData?.src || userData?.profilePhoto || defaultProfilePhoto}
              alt={'Profile Photo'}
              layout={'responsive'}
              objectFit={'cover'}
              width={96}
              height={96}
            />
          </span>
        )}
        <label className="my-2" htmlFor="imageIput">
          <FileInputButton
            type="button"
            text={'Change'}
            buttonStyle="basic"
            id={'imageInput'}
            name={'imgageInput'}
            maxFileSizeInKB={1000}
            onUpload={(value: FileData) => Upload(value)}
            allowedExtensions={['jpeg', 'jpeg', 'png']}
            setLoading={setImageLoading}
          />
        </label>
      </div>
    </div>
  );
}

function EmailNotificationsFieldset() {
  const {user, userData} = useContext(UserContext);
  const emailNotifications = userData?.communications ? userData.communications.email : null;

  return (
    <fieldset>
      <legend className="text-base font-medium text-gray-900 dark:text-slate-300">By Email</legend>
      <div className="mt-4 space-y-4">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="comments_email"
              name="comments_email"
              type="checkbox"
              defaultChecked={emailNotifications?.comments}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments_email" className="font-medium text-gray-700 dark:text-slate-300">
              Comments
            </label>
            <p className="text-gray-500 dark:text-slate-400">
              Get notified when someones posts a comment on a posting.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="projects_email"
              name="projects_email"
              type="checkbox"
              defaultChecked={emailNotifications?.projects}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="projects_email" className="font-medium text-gray-700 dark:text-slate-300">
              Projects
            </label>
            <p className="text-gray-500 dark:text-slate-400">Get notified by projects (eg. spaceX updater)</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="updates_email"
              name="updates_email"
              type="checkbox"
              defaultChecked={emailNotifications?.updates}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="updates_email" className="font-medium text-gray-700 dark:text-slate-300">
              Updates
            </label>
            <p className="text-gray-500 dark:text-slate-400">Get notified when a new project is ready for testing</p>
          </div>
        </div>
      </div>
    </fieldset>
  );
}

function PushNotificationsFieldset() {
  const {user, userData} = useContext(UserContext);
  const pushCommunications = userData?.communications ? userData.communications.push : null;
  return (
    <fieldset>
      <div>
        <legend className="text-base font-medium text-gray-900 dark:text-slate-300">Push Notifications</legend>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          These are delivered as banner notifications to your mobile or desktop.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <input
            id="comments_push"
            name="comments_push"
            type="checkbox"
            defaultChecked={pushCommunications?.comments}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="comments_push" className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
            Comments
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="projects_push"
            name="projects_push"
            type="checkbox"
            defaultChecked={pushCommunications?.projects}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="projects_push" className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
            Projects
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="updates_push"
            name="updates_push"
            type="checkbox"
            defaultChecked={pushCommunications?.updates}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="updates_push" className="ml-3 block text-sm font-medium text-gray-700 dark:text-slate-300">
            Updates
          </label>
        </div>
      </div>
    </fieldset>
  );
}

const SaveBtn = (props) => {
  const isValid = props.isValid;
  return <Button type="submit" disabled={!isValid} text={'Save'} />;
};

function SignOutBtn() {
  const router = useRouter();

  const signOut = async () => {
    await auth.signOut();
    await router.push('/');
  };
  return <Button type="button" text="Log Out" buttonStyle="basic" function={signOut} />;
}
