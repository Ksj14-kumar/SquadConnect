import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
function PDF({ base, type }: { base: string, type: string }) {
    const [pageNumber, setPageNumber] = useState<number>(1)
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setPageNumber(numPages)
    }
    return (
        <div>
            <Document file={base}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.log("Inside Error", error)}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            {/* <p>
                Page {pageNumber} of {numPages}
            </p> */}
        </div>
    )
}
export default PDF