import {Fragment, useContext, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMailBulk, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {Toast, ToastData} from './toast';
import {addMail} from '../lib/FirestoreOperations';

function validateEmail(email) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}

const AddEmailModal = (params) => {
  const open = params.open; // open state of the modal
  const setOpen = params.setOpen; // change open state of modal

  const [showToast, setShowToast] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const [toastData, setToastData] = useState<ToastData>();

  const onSubmit = async () => {
    const mail = {
      to: [email],
      bcc: ['admin@rafaelzasas.com'],
      from: 'admin@rafaelzasas.com',
      template: {
        name: 'resumeRequest',
        data: {
          username: username,
        },
      },
    };

    try {
      // Some error handling to make sure users dont pull a fast one
      if (!validateEmail(email)) {
        throw new Error(`Please a valid Email or Login :)`);
      } else if (username.length < 3) {
        throw new Error('Please a valid Name or Login :)');
      }

      // queue mail for delivery
      await addMail(mail);

      // display success toast
      setToastData({
        heading: 'Resume Sent!',
        body: `Check your inbox for ${email}`,
        type: 'success',
      });
      setShowToast(true);
      setTimeout(() => {
        setOpen(false);
      }, 2500);

      // end success of mail delivery
    } catch (e) {
      console.log(e);
      setToastData({
        heading: 'Whoops',
        body: e.message,
        type: 'error',
      });
      setShowToast(true);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" auto-reopen="true" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
        <div className="flex min-h-screen items-start justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div>
                  <Toast setShow={setShowToast} toastData={toastData} show={showToast} />
                </div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <FontAwesomeIcon className="h-6 w-6 text-green-600" aria-hidden="true" icon={faMailBulk} />
                </div>

                {/* Dialog Title  */}
                <Dialog.Title as="h3" className="mt-1 text-lg font-medium leading-6 text-gray-900">
                  Please enter your details
                </Dialog.Title>

                <form className="mt-3 text-center sm:mt-5" onSubmit={onSubmit}>
                  {/* Form Input for Users Name  */}
                  <div className="my-2">
                    <label htmlFor="name" className="ml-px block pl-4 text-sm font-medium text-gray-700"></label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => {
                          setUsername(e.currentTarget.value);
                        }}
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full rounded-full
                                                 border-gray-300 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  {/* Form Input for Users Email  */}
                  <div className="my-2">
                    <label htmlFor="email" className="ml-px block pl-4 text-sm font-medium text-gray-700"></label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => {
                          setEmail(e.currentTarget.value);
                        }}
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        className="block w-full rounded-full
                                                 border-gray-300 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={async () => {
                    await onSubmit();
                  }}
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent
                                     bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 px-4 py-2 text-base
                                      font-medium text-white shadow-sm
                                      hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-400
                                       focus:ring-offset-2 sm:text-sm"
                >
                  <div className="align-middle">
                    Send <FontAwesomeIcon icon={faPaperPlane} className="ml-1" />
                  </div>
                </button>
              </div>
              <div className="mt-5 flex flex-col items-center justify-center sm:mt-6">
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  type="button"
                  className="inline-flex w-16 justify-center rounded-md border border-transparent
                                     bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-base font-medium text-white shadow-sm
                                      hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400
                                       focus:ring-offset-2 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddEmailModal;
