import React, {useEffect, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {storage} from "../lib/firebase";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function ResumePage({}) {

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [file, setFile] = useState('');

    const [width, setWidth] = useState<number>(window.innerWidth?? 600);

    storage.refFromURL('gs://rafael-zasas.appspot.com/PDFResumeSept2021.pdf')
        .getDownloadURL()
        .then(res => {
            setFile(res);
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
    }

    const  getWidth = () => {
        return width < 700? 300: 600
    }

    return (
        <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="max-w-max mx-auto">
                <main className="sm:flex sm:w-full">
                    <Document
                        renderMode= 'canvas'
                        file={file}
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

)
}
