import React, {useContext, useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {storage, firestore} from "../lib/firebase";
import {MailIcon} from '@heroicons/react/solid'
import {DocumentDownloadIcon} from '@heroicons/react/outline'
import {UserContext} from "../lib/context";
import AddEmailModal from '../components/addEmailModal'
import {Toast} from "../components/toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function ResumePage({}) {

    /** HOOKS */

        // For PDF document
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [resume, setResume] = useState('');

    // For modal if user isn't signed in
    const [openAddEmailModal, setOpenAddEmailModal] = useState(false);
    const [width, setWidth] = useState<number>(null);

    //  For showing toast and its data
    const [showToast, setShowToast] = useState(false);
    const [toastData, setToastData] = useState({
        heading: '',
        body: '',
        type: '',
    })

    /** END HOOKS */


    storage.refFromURL('gs://rafael-zasas.appspot.com/PDFResumeSept2021.pdf')
        .getDownloadURL()
        .then(res => {
            setResume(res);
        })

    /**
     * Needed because the add event listener function can't take setWidth()
     */
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    /**
     * Sets the width of the screen on resize so that the pdf can compute which size of doc to load
     */
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);


    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
        setWidth(window.innerWidth);
    }


    return (
        <div>
            <AddEmailModal open={openAddEmailModal}
                           setOpen={setOpenAddEmailModal}/>
            <div className="bg-white min-h-screen px-4 py-14 sm:px-6 py-16 md:grid place-items-center lg:px-8">
                <div className="max-w-max mx-auto">
                    <main className="sm:flex sm:w-full">
                        <Document
                            renderMode='canvas'
                            file={resume}
                            loading={loader}
                            noData={loader}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={width}
                                scale={0.8}
                            />
                        </Document>
                        <p>Page {pageNumber} of {numPages}</p>
                    </main>
                </div>
            </div>

            <div className='flex-row mb-6 mx-12 sm:mt-0'>
                <SendButton
                    resume={resume}
                    modal={{open: openAddEmailModal, setOpen: setOpenAddEmailModal}}
                    toast={{
                        showToast: showToast,
                        setShowToast: setShowToast,
                        toastData: toastData,
                        setToastData: setToastData
                    }}
                />
                <DownloadButton resume={resume}/>
            </div>

            <Toast
                setShow={setShowToast}
                toastData={toastData}
                show={showToast}
            />
        </div>

    )
}

/**
 * Spinner to show that the pdf is loading
 */
const loader = () => {
    return (
        <div className="absolute inset-y-0 flex items-center pointer-events-none">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-2 border-blue-500"/>
        </div>
    )
}

/**
 * Component and Logic for sending the resume. Will prompt user to enter email with a modal if not logged in.
 * @param params {
 * resume: string;
 * modal: {[open: Boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>]};
 * toast: {
 * {[showToast: Boolean, setShowToast: React.Dispatch<React.SetStateAction<boolean>>]},
 * {[toastData: Boolean, setToastData: React.Dispatch<React.SetStateAction<boolean>>]}
 *   }
 * }
 * }
 * @constructor
 */
const SendButton = (params) => {

    const {user, userData} = useContext(UserContext);

    const sendResume = async () => {
        if (user) {
            const mail = {
                to: [user.email],
                bcc: ['admin@rafaelzasas.com'],
                from: 'admin@rafaelzasas.com',
                template: {
                    name: 'resumeRequest',
                    data: {
                        username: userData.username,
                        resume: params.resume,
                    }
                }
            }
            try {
                await firestore.collection(`mail`).add(mail);

                // display success toast
                params.toast.setToastData({
                    heading: 'Resume Sent!',
                    body: `Check your inbox for ${user.email}`,
                    type: 'success'
                });

                params.toast.setShowToast(true);
                setTimeout(() => {
                    params.toast.setShowToast(false);
                }, 3000);


            } catch (e) {
                console.log(e);
                params.toast.setToastData({
                    heading: 'Error sending resume',
                    body: e.message,
                    type: 'error'
                });
                params.toast.setShowToast(true);
                setTimeout(() => {
                    params.toast.setShowToast(false)
                }, 3000);
            }
        } else {
            params.modal.setOpen(true);
        }
    }

    return (
        <button
            type="button"
            onClick={sendResume}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium
                     rounded-full shadow-sm text-white mx-2
                      bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Send
            <MailIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true"/>
        </button>
    )
}

/**
 * Button to download resume to device
 * @param params {resume: {string} The url of the resume to be downloaded}
 * @constructor
 */
const DownloadButton = (params) => {
    return (
        <a
            href={params.resume}
            target='_blank'
            type="button"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium
                     rounded-full shadow-sm text-white
                      bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Download
            <DocumentDownloadIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true"/>
        </a>
    )
}
