import {useContext, useEffect, useState, useCallback} from 'react';
import {UserContext} from '../lib/context';
import {ExclamationCircleIcon} from '@heroicons/react/solid';
import {auth} from '../lib/firebase';
import {useRouter} from 'next/router';
import debounce from 'lodash.debounce';
import {Toast, ToastData} from '../components/toast';
import Metatags from '../components/Metatags';
import {getUsersByField, updateUser} from '../lib/FirestoreOperations';

export default function ProfilePage({}) {
  const {user, userData} = useContext(UserContext);
  const [isValid, setIsValid] = useState(true);
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState<ToastData>();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      website: e.target.website.value,
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
      await updateUser(user.uid, formData);
      setToastData({
        heading: 'Success!',
        body: 'Your profile and preferences have been saved.',
        type: 'success',
      });
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    } catch (e) {
      console.log(e);
      setToastData({
        heading: 'Error Updating Profile',
        body: e.message,
        type: 'error',
      });
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };

  return (
    <main>
      <Metatags title="Profile" description="User Profile" currentURL="rafaelzasas.com/profile" />
      <form className="space-y-6 px-5 py-4" onSubmit={onSubmit}>
        <>
          <Toast setShow={setShow} toastData={toastData} show={show} />{' '}
        </>
        {/* Form Inputs */}
        <div
          className="bg-white bg-opacity-50 bg-clip-padding px-4 py-5 shadow
             backdrop-filter sm:rounded-lg sm:p-6 lg:backdrop-blur-md"
        >
          {/* Heading */}
          <div className="w-full pb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed on the feedback section and your public profile.
            </p>
          </div>

          {/* Personal Info Section */}

          <div className="mt-2 w-full md:gap-6">
            <div className="mt-5 md:mt-0">
              <div className="space-y-6">
                <UsernameInput formValidityState={[isValid, setIsValid]} />

                <WebsiteInput />

                <BioInput />

                <PhotoInput />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div
          className="bg-white bg-opacity-50 bg-clip-padding px-4 py-5 shadow
            backdrop-filter sm:rounded-lg sm:p-6 lg:backdrop-blur-md"
        >
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
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
        </div>

        <div className="sm:block md:block lg:block xl:block">
          <div className="">
            {/*<CancelBtn/>*/}
            <SaveBtn isValid={isValid} />
          </div>

          <div className="float-right mb-2 sm:mt-2">
            <SignOutBtn />
          </div>
        </div>
      </form>
    </main>
  );
}

const UsernameInput = (props) => {
  // validity state passed into component as a property- used in parent to disable submit button
  const [isValid, setIsValid] = props.formValidityState;
  const [loading, setLoading] = useState(false);
  const [usernameValue, setUsernameValue] = useState('hopefullyNobodyUsesThis');
  const {user, userData} = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const usernameClasses = {
    valid: `block w-full pr-10 border-gray-300 placeholder-gray-300
        focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`,
    invalid: `block w-full pr-10 border-red-300 text-red-900 placeholder-red-300
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
    <div className="grid grid-cols-4 ">
      <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="relative mt-1 rounded-md shadow-sm ">
          <input
            type="text"
            name="username"
            id="username"
            onChange={onChange}
            className={isValid ? usernameClasses.valid : usernameClasses.invalid}
            placeholder={userData?.username ? userData?.username : 'username'}
            defaultValue={userData?.username ? userData?.username : 'username'}
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
    </div>
  );
};

function WebsiteInput() {
  const {user, userData} = useContext(UserContext);

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span
            className="inline-flex items-center rounded-l-md border border-r-0
                                             border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
          >
            https://
          </span>
          <input
            type="text"
            name="website"
            id="website"
            defaultValue={userData?.website ? userData.website : null}
            className="block w-full flex-1
                                            rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            name="bio"
            rows={3}
            className="block w-full rounded-md border border-gray-300
                                         p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="eg. Hi, my name Jeff"
            defaultValue={userData?.bio ? userData.bio : ''}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">Brief description for your profile. URLs are hyperlinked.</p>
      </div>
    </div>
  );
}

function PhotoInput() {
  const {user, userData} = useContext(UserContext);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Photo</label>
      <div className="mt-1 flex items-center space-x-5">
        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          {!userData?.profilePhoto && (
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}

          {userData?.profilePhoto && (
            <img className="h-full w-full text-gray-300" src={userData.profilePhoto} width={96} height={96} />
          )}
        </span>
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Change
        </button>
      </div>
    </div>
  );
}

function EmailNotificationsFieldset() {
  const {user, userData} = useContext(UserContext);
  const emailNotifications = userData?.communications ? userData.communications.email : null;

  return (
    <fieldset>
      <legend className="text-base font-medium text-gray-900">By Email</legend>
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
            <label htmlFor="comments_email" className="font-medium text-gray-700">
              Comments
            </label>
            <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
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
            <label htmlFor="projects_email" className="font-medium text-gray-700">
              Projects
            </label>
            <p className="text-gray-500">Get notified by projects (eg. spaceX updater)</p>
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
            <label htmlFor="updates_email" className="font-medium text-gray-700">
              Updates
            </label>
            <p className="text-gray-500">Get notified when a new project is ready for testing</p>
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
        <legend className="text-base font-medium text-gray-900">Push Notifications</legend>
        <p className="text-sm text-gray-500">These are delivered as banner notifications to your mobile or desktop.</p>
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
          <label htmlFor="comments_push" className="ml-3 block text-sm font-medium text-gray-700">
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
          <label htmlFor="projects_push" className="ml-3 block text-sm font-medium text-gray-700">
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
          <label htmlFor="updates_push" className="ml-3 block text-sm font-medium text-gray-700">
            Updates
          </label>
        </div>
      </div>
    </fieldset>
  );
}

function CancelBtn() {
  return (
    <button
      type="button"
      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700
                     shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300
                     focus:ring-offset-2"
    >
      Cancel
    </button>
  );
}

const SaveBtn = (props) => {
  const isValid = props.isValid;
  return (
    <button
      type="submit"
      disabled={!isValid}
      className="ml-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4
                     text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    >
      Save
    </button>
  );
};

function SignOutBtn() {
  const router = useRouter();

  const signOut = async () => {
    await auth.signOut();
    await router.push('/');
  };
  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm
             font-medium text-gray-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500
                     focus:ring-offset-2"
    >
      Log Out
    </button>
  );
}
