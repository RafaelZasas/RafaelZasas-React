import React, {useContext, useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {storage, firestore} from "../lib/firebase";
import {MailIcon} from '@heroicons/react/solid'
import {DocumentDownloadIcon} from '@heroicons/react/outline'
import {UserContext} from "../lib/context";
import AddEmailModal from '../components/addEmailModal'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function ResumePage({}) {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [resume, setResume] = useState('');
    const [openAddEmailModal, setOpenAddEmailModal] = useState(false);
    const [width, setWidth] = useState<number>(null);

    storage.refFromURL('gs://rafael-zasas.appspot.com/PDFResumeSept2021.pdf')
        .getDownloadURL()
        .then(res => {
            setResume(res);
        })

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

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

    const getWidth = () => {
        switch (true) {
            case (width < 350):
                return 200;
            case (width >= 350 && width < 400):
                return 250;
            case (width >= 400 && width < 500):
                return 300;
            case (width >= 500 && width < 600):
                return 400;
            case  (width >= 600 && width < 700):
                return 500;
            case  (width >= 700 && width < 900):
                return 600;
            case  (width >= 900 && width < 1200):
                return 800;
            default:
                return 1000;

        }
    }

    return (
        <div>
            <AddEmailModal open={openAddEmailModal} setOpen={setOpenAddEmailModal}/>
            <div className="bg-white min-h-screen px-4 py-14 sm:px-6 py-16 md:grid place-items-center lg:px-8">
                <div className="max-w-max mx-auto">
                    <main className="sm:flex sm:w-full">
                        <Document
                            renderMode='canvas'
                            file={resume}
                            loading={loader}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={getWidth()}
                            />
                        </Document>
                        <p>Page {pageNumber} of {numPages}</p>
                    </main>
                </div>
            </div>

            <div className='flex-row mb-6 mx-12 sm:mt-0'>
                <SendButton resume={resume} modal={{open: openAddEmailModal, setOpen: setOpenAddEmailModal}}/>
                <DownloadButton resume={resume}/>
            </div>


        </div>

    )
}


const loader = () => {
    return (
        <div className="absolute inset-y-0 flex items-center pointer-events-none">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-2 border-blue-500"/>
        </div>
    )
}

const SendButton = (params) => {

    const {user, userData} = useContext(UserContext);

    const sendResume = async () => {
        if (user){
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
                await firestore.collection(`mail`).add(mail)
            } catch (e) {
                console.log(e)
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
