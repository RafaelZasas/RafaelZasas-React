import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {storage} from '../lib/firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {DocumentDownloadIcon} from '@heroicons/react/outline';
import {ToastContext, UserContext} from '../lib/context';
import AddEmailModal from '../components/addEmailModal';
import Button from '../components/Button';
import Metatags from '../components/Metatags';
import {addMail} from '../lib/FirestoreOperations';

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

  /** END HOOKS */

  const gsReference = ref(storage, 'gs://rafael-zasas.appspot.com/PDF-Resume-March2022.pdf');

  getDownloadURL(gsReference).then((res) => {
    setResume(res);
  });

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
    };
  }, []);

  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
    setWidth(window.innerWidth);
  }

  return (
    <main>
      <Metatags
        title="Resume"
        description="Resume for rafaelzasas which you can download or send to yourself"
        currentURL="rafaelzasas.com/resume"
      />
      <AddEmailModal open={openAddEmailModal} setOpen={setOpenAddEmailModal} />
      <div className="mb-4 min-h-screen place-items-center bg-white px-4 py-14 sm:px-6 md:grid md:py-16 lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex sm:w-full">
            <Document
              renderMode="canvas"
              file={resume}
              loading={loader}
              noData={loader}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} width={width} scale={0.8} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </main>
        </div>
      </div>

      <div className="mx-12 my-6 flex-row space-x-4 sm:mt-0">
        <SendButton resume={resume} setOpenModal={setOpenAddEmailModal} />
        <DownloadButton resume={resume} />
      </div>
    </main>
  );
}

/**
 * Spinner to show that the pdf is loading
 */
const loader = () => {
  return (
    <div className="pointer-events-none absolute inset-y-0 flex items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
    </div>
  );
};

interface SendButtonProps {
  resume: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const SendButton = (props: SendButtonProps) => {
  const {user, userData} = useContext(UserContext);
  const {setShowToast, setToastData} = useContext(ToastContext);
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
            resume: props.resume,
          },
        },
      };
      try {
        await addMail(mail);

        // display success toast
        setToastData({
          heading: 'Resume Sent!',
          body: `Check your inbox for ${user.email}`,
          type: 'success',
        });

        setShowToast(true);
      } catch (e) {
        console.log(e);
        setToastData({
          heading: 'Error sending resume',
          body: e.message,
          type: 'error',
        });
        setShowToast(true);
      }
    } else {
      props.setOpenModal(true);
    }
  };

  return <Button text={'Send'} function={sendResume} type={'button'} rightIcon={faEnvelope} />;
};

/**
 * Button to download resume to device
 * @param props {resume: {string} The url of the resume to be downloaded}
 * @constructor
 */
const DownloadButton = (props) => {
  return (
    <a
      href={props.resume}
      target="_blank"
      type="button"
      rel="noreferrer"
      className="inline-flex items-center rounded-md border
            border-transparent bg-blue-600/80 px-4 py-2 text-base font-medium 
            text-white drop-shadow-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
    >
      Download
      <DocumentDownloadIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
    </a>
  );
};
