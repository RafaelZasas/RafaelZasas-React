import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import Image from 'next/image'


interface ModalProps {
    header: string | ReactJSXElement;
    body: string | ReactJSXElement;
    setOpen: ((value: boolean) => void);
    open: boolean
    headerImg?: string
}

export default function Modal(props: ModalProps) {

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-scroll" onClose={props.setOpen}>
                <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                        <div className="inline-block align-bottom bg-white rounded-lg 
                        max-w-5xl sm:w-full sm:align-middle
                        px-4 pt-5 pb-4 sm:p-6 mt-2 md:mt-4
                        text-left overflow-hidden shadow-xl transform transition-all">
                            <div>
                                {props.headerImg &&
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-400/75 px-2 pb-1">
                                        <Image
                                            className="inline-block rounded-full"
                                            width={400}
                                            height={400}
                                            src={props.headerImg} alt=" headerImg" />
                                    </div>
                                }
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="div" className="text-lg leading-6 font-medium text-gray-900">
                                        {props.header}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        {props.body}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 
                                    bg-blue-600/75 text-base font-medium text-white hover:bg-blue-600
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
    )
}