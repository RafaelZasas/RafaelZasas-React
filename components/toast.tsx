/* This example requires Tailwind CSS v2.0+ */
import React, {Dispatch, Fragment, SetStateAction, useEffect} from 'react';
import {Transition} from '@headlessui/react';
import {CheckCircleIcon, ExclamationCircleIcon, InfoCircleIcon, XIcon} from '../public/svg-icons';
import {useRouter} from 'next/router';

export interface ToastData {
  heading: string;
  body: string;
  type: 'error' | 'success' | 'info';
  internalLink?: string;
  externalLink?: string;
}

interface ToastProps {
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
  toastData: ToastData;
}
/**
 * Displays a toast with an icon, heading and message
 * @param {ToastProps} props
 */
export const Toast = (props: ToastProps) => {
  const show = props.show;
  const setShow = props.setShow;
  const router = useRouter();

  useEffect(() => {
    show &&
      setTimeout(() => {
        setShow(false);
      }, 4500);
  }, [setShow, show]);
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="pointer-events-auto w-full max-w-sm cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              onClick={() => {
                if (props.toastData.externalLink) {
                  window.open(props.toastData.externalLink, '_blank').focus();
                }
                if (props.toastData.internalLink) {
                  router.push(props.toastData.internalLink);
                }
              }}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 self-center">
                    {props.toastData?.type === 'success' && <CheckCircleIcon className={'h-8 w-8 fill-emerald-500'} />}
                    {props.toastData?.type === 'error' && <ExclamationCircleIcon className={'h-8 w-8 fill-red-500'} />}
                    {props.toastData?.type === 'info' && <InfoCircleIcon className={'h-8 w-8 fill-blue-500'} />}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{props.toastData?.heading}</p>
                    <p className="mt-1 text-sm text-gray-500">{props.toastData?.body}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};
