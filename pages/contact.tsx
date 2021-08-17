import {Fragment, useEffect, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMailBulk, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import Router from 'next/router'

export default function ContactModal() {
    const [open, setOpen] = useState(true);

    // this will route user back once they click out
    useEffect(() => {
        !open? Router.back() : null;
    })

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" auto-reopen="true"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setOpen}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                        <div
                            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div
                                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FontAwesomeIcon className="h-6 w-6 text-green-600" aria-hidden="true"
                                                     icon={faMailBulk}/>
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Connect with me
                                    </Dialog.Title>
                                    {/* Form Inputs for email info */}
                                    <div className={'my-2'}>
                                        <label htmlFor="name"
                                               className="ml-px pl-4 block text-sm font-medium text-gray-700">
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500
                                                 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
                                                placeholder="Subject"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-3 sm:items-start
                                     sm:pt-1">
                                        <label htmlFor="about">
                                        </label>
                                        <div className="mt-1 sm:mt-1 col-span-full">
                                            <textarea
                                                id="about"
                                                name="about"
                                                rows={3}
                                                placeholder='Body'
                                                className="max-w-lg shadow-sm block w-full focus:ring-bue-500 p-1.5
                                                 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                                                defaultValue={''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent
                                     shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white
                                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                       focus:ring-indigo-400 sm:text-sm"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <div className='align-middle'>
                                        Send <FontAwesomeIcon icon={faPaperPlane} className='ml-1'/>
                                    </div>
                                </button>
                            </div>
                            <div className="mt-5 sm:mt-6 flex flex-col justify-center items-center">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-16 rounded-md border border-transparent
                                     shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white
                                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                       focus:ring-red-400 sm:text-sm"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
