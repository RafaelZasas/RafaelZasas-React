import {Fragment, useContext, useEffect, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMailBulk, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {firestore} from "../lib/firebase";
import {Toast} from "./toast";

function validateEmail (email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
}


const AddEmailModal = (params) => {
    const open = params.open; // open state of the modal
    const setOpen = params.setOpen; // change open state of modal

    const [showToast, setShowToast] = useState(false);

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('');

    const [toastData, setToastData] = useState({
        heading: '',
        body: '',
        type: '',
    })

    const onSubmit = async () => {

        const mail = {
            to: [email],
            bcc: ['admin@rafaelzasas.com'],
            from: 'admin@rafaelzasas.com',
            template: {
                name: 'resumeRequest',
                data: {
                    username: username,
                }
            }
        }

        try {

            // Some error handling to make sure users dont pull a fast one
            if (!validateEmail(email)){
                throw new Error('Please a valid email or Login :)')
            } else if (username.length<3){
                throw new Error('Please a valid name or Login :)')
            }

            // queue mail for delivery
            await firestore.collection('mail').add(mail);


            // display success toast
            setToastData({
                heading: 'Resume Sent!',
                body: `Check your inbox for ${email}`,
                type: 'success'
            })
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setOpen(false);
            }, 2500);

            // end success of mail delivery
            
        } catch (e) {
            console.log(e);
            setToastData({
                heading: 'Whoops',
                body: e.message,
                type: 'error'
            });
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false)
            }, 3000);
        }
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
                                        setShow={setShowToast}
                                        toastData={toastData}
                                        show={showToast}
                                    />
                                </div>
                                <div
                                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FontAwesomeIcon className="h-6 w-6 text-green-600" aria-hidden="true"
                                                     icon={faMailBulk}/>
                                </div>

                                {/* Dialog Title  */}
                                <Dialog.Title as="h3" className="mt-1 text-lg leading-6 font-medium text-gray-900">
                                    Please enter your details
                                </Dialog.Title>


                                <form className="mt-3 text-center sm:mt-5" onSubmit={onSubmit}>

                                    {/* Form Input for Users Name  */}
                                    <div className='my-2'>
                                        <label htmlFor="name"
                                               className="ml-px pl-4 block text-sm font-medium text-gray-700">
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                onChange={(e) => {
                                                    setUsername(e.currentTarget.value)
                                                }}
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500
                                                 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Form Input for Users Email  */}
                                    <div className='my-2'>
                                        <label htmlFor="email"
                                               className="ml-px pl-4 block text-sm font-medium text-gray-700">
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                onChange={(e) => {
                                                    setEmail(e.currentTarget.value)
                                                }}
                                                id="email"
                                                name="email"
                                                type="text"
                                                placeholder='Email'
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500
                                                 block w-full sm:text-sm border-gray-300 px-4 rounded-full"
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

export default  AddEmailModal;
