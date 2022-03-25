import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {ReactJSXElement} from '@emotion/react/types/jsx-namespace';
import CustomImage from './Image';

interface ModalProps {
  header: string | ReactJSXElement;
  body: string | ReactJSXElement;
  setOpen: (value: boolean) => void;
  open: boolean;
  headerImg?: string;
}

export default function Modal(props: ModalProps) {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-scroll" onClose={props.setOpen}>
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
            <div
              className="mt-2 inline-block max-w-5xl transform 
                        overflow-hidden rounded-lg bg-white
                        px-4 pt-5 pb-4 text-left align-bottom shadow-xl
                        transition-all sm:w-full sm:p-6 sm:align-middle md:mt-4"
            >
              <div>
                {props.headerImg && (
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/75 px-2 pb-1">
                    <CustomImage
                      className="inline-block rounded-full"
                      width={400}
                      height={400}
                      src={props.headerImg}
                      alt=" headerImg"
                    />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="div" className="text-lg font-medium leading-6 text-gray-900">
                    {props.header}
                  </Dialog.Title>
                  <div className="mt-2">{props.body}</div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600/75 px-4 py-2 
                                    text-base font-medium text-white shadow-sm hover:bg-blue-600
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                  onClick={() => props.setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
