import {Fragment, useContext, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMailBulk, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import {UserContext} from '../lib/context';
import {Toast, ToastData} from '../components/toast';
import {addMail} from '../lib/FirestoreOperations';

export default function ContactModal() {
  const [openModal, setOpenModal] = useState(true); // hook for contact modal
  const {user, userData} = useContext(UserContext);
  const [showToast, setShowToast] = useState(false);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [toastData, setToastData] = useState<ToastData>();

  // this will route user back once they click out
  useEffect(() => {
    !openModal ? Router.back() : null;
  });

  const onSubmit = async () => {
    const sendMessage = async () => {
      const mail = {
        to: ['admin@rafaelzasas.com'],
        template: {
          name: 'contact',
          data: {
            username: userData.username,
            email: user.email,
            body: body,
            subject: subject,
          },
        },
      };

      try {
        await addMail(mail);
        setToastData({
          heading: 'Mail Sent!',
          body: "Thanks! I'll get back to you shortly",
          type: 'success',
        });
        setShowToast(true);
        setTimeout(() => {
          setOpenModal(false);
        }, 2500);
      } catch (e) {
        console.log(e);
        setToastData({
          heading: 'Error sending message',
          body: e.message,
          type: 'error',
        });
        setShowToast(true);
      }
    };
    const promptLogin = () => {
      setToastData({
        heading: 'Whoops!',
        body: 'You have to Login to use this feature',
        type: 'error',
      });
      setShowToast(true);
      setTimeout(() => {
        setOpenModal(false);
      }, 3000);
    };

    user ? await sendMessage() : promptLogin();
  };

  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog as="div" auto-reopen="true" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpenModal}>
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
                <form className="mt-3 text-center sm:mt-5" onSubmit={onSubmit}>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Connect with me
                  </Dialog.Title>
                  {/* Form Inputs for email info */}
                  <div className={'my-2'}>
                    <label htmlFor="subject" className="ml-px block pl-4 text-sm font-medium text-gray-700"></label>
                    <div className="mt-1">
                      <input
                        onChange={(e) => {
                          setSubject(e.currentTarget.value);
                        }}
                        type="text"
                        name="subject"
                        id="subject"
                        className="block w-full rounded-full
                                                 border-gray-300 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Subject"
                      />
                    </div>
                  </div>
                  <div
                    className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-3
                                     sm:pt-1"
                  >
                    <label htmlFor="body"></label>
                    <div className="col-span-full mt-1 sm:mt-1">
                      <textarea
                        id="body"
                        name="body"
                        onChange={(e) => {
                          setBody(e.currentTarget.value);
                        }}
                        rows={3}
                        placeholder="Body"
                        className="focus:ring-bue-500 block w-full max-w-lg rounded-md border
                                                 border-gray-300 p-1.5 shadow-sm focus:border-blue-500 sm:text-sm"
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
                    setOpenModal(false);
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
}
