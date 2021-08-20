import {Fragment, useContext, useEffect, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMailBulk, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import Router from 'next/router'
import {firestore} from "../lib/firebase";
import {UserContext} from "../lib/context";
import {Toast} from "../components/toast";
import Link from "next/link";

export default function ContactModal() {
    const [open, setOpen] = useState(true); // hook for contact modal
    const {user, userData} = useContext(UserContext);
    const [show, setShow] = useState(false);

    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const [toastData, setToastData] = useState({
        heading: '',
        body: '',
        type: '',
    })

    // this will route user back once they click out
    useEffect(() => {
        !open ? Router.back() : null;
    })

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
                        subject: subject
                    }
                }
            }

            try {
                await firestore.collection('mail').add(mail);
                setToastData({
                    heading: 'Mail Sent!',
                    body: 'Thanks! I\'ll get back to you shortly',
                    type: 'success'
                })
                setShow(true);
                setTimeout(() => {
                    setShow(false);
                    setOpen(false);
                }, 2500);
            } catch (e) {
                console.log(e);
                setToastData({
                    heading: 'Error sending message',
                    body: e.message,
                    type: 'error'
                });
                setShow(true);
                setTimeout(() => {
                    setShow(false)
                }, 2000);
            }
        }
        const promptLogin =  () => {


            setToastData({
                heading: 'Whoops!',
                body: 'You have to Login to use this feature',
                type: 'error'
            });
            setShow(true);
            setTimeout(() => {
                setShow(false)
                setOpen(false);
            }, 3000);
        }

        user? await sendMessage() : promptLogin();

    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" auto-reopen="true"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setOpen}
            >
                <div
                    className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                                <div>
                                    <Toast
                                        setShow={setShow}
                                        toastData={toastData}
                                        show={show}
                                    />
                                </div>
                                <div
                                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FontAwesomeIcon className="h-6 w-6 text-green-600" aria-hidden="true"
                                                     icon={faMailBulk}/>
                                </div>
                                <form className="mt-3 text-center sm:mt-5" onSubmit={onSubmit}>
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Connect with me
                                    </Dialog.Title>
                                    {/* Form Inputs for email info */}
                                    <div className={'my-2'}>
                                        <label htmlFor="subject"
                                               className="ml-px pl-4 block text-sm font-medium text-gray-700">
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                onChange={(e) => {
                                                    setSubject(e.currentTarget.value)
                                                }}
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500
                                                 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
                                                placeholder="Subject"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-3 sm:items-start
                                     sm:pt-1">
                                        <label htmlFor="body">
                                        </label>
                                        <div className="mt-1 sm:mt-1 col-span-full">
                                            <textarea
                                                id="body"
                                                name="body"
                                                onChange={(e) => {
                                                    setBody(e.currentTarget.value)
                                                }}
                                                rows={3}
                                                placeholder='Body'
                                                className="max-w-lg shadow-sm block w-full focus:ring-bue-500 p-1.5
                                                 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    onClick={async () => {
                                        await onSubmit()
                                    }}
                                    type="submit"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent
                                     shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500
                                      text-base font-medium text-white
                                      hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                       focus:ring-indigo-400 sm:text-sm"
                                >
                                    <div className='align-middle'>
                                        Send <FontAwesomeIcon icon={faPaperPlane} className='ml-1'/>
                                    </div>
                                </button>
                            </div>
                            <div className="mt-5 sm:mt-6 flex flex-col justify-center items-center">
                                <button
                                    onClick={() => {
                                        setOpen(false)
                                    }}
                                    type="button"
                                    className="inline-flex justify-center w-16 rounded-md border border-transparent
                                     shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white
                                      hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                                       focus:ring-red-400 sm:text-sm">
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
