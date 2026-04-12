import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";


import worker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function App() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");

  const pdfRef = useRef(null);


  const handleSelection = () => {
    // window.getSelection() with the help of this you get all the selected text on the ui 
    const selection = window.getSelection();
    // selection is a complex obejct having lot of thigns inside this obejct we only need the text selected text so using to string gives only the text 
    // console.log(selection)
    const text = selection.toString().trim();

    if (!text) return;

    // now since user can select anything inside the ui bt we only need the text inside the pdf


    const isInside =
    // selection.anchorNode point from where selction started 
      pdfRef.current?.contains(selection.anchorNode) &&
    // selection.focusNode point till where selection happens 
      pdfRef.current?.contains(selection.focusNode);
    // and because these both must be inside the pdf

    if (!isInside) return;

    setSelectedText(text);
  };

  return (
    <div >
      
      <h1 >📄 Smart PDF Viewer</h1>


      <div >
        <input
          className="cursor-pointer"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
          // console.log(e)
          // e is a object containing everythign about the event
          // e.target gives the input which is trigerred 
          // e.target.files[0]-> it has list of files user selected since user may select multiple i am saying provide me first selected file 

            const f = e.target.files[0];
            if (f) {
              setFile(f);
              setPageNumber(1);
              setSelectedText("");
            }
          }}
        />
      </div>

      {/* if there is any selectd file then move to next things else this part remains false  */}
      {file && (
        <>
          <div
            ref={pdfRef}
            onMouseUp={handleSelection}
            style={styles.viewer}
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <div style={styles.pageWrapper}>
                <Page
                  pageNumber={pageNumber}
                  width={800}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </div>
            </Document>
          </div>


          <div style={styles.controls}>
            <button
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber <= 1}
              style={styles.button}
            >
              ⬅ Prev
            </button>

            <span style={styles.pageInfo}>
              Page {pageNumber} / {numPages}
            </span>

            <button
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={pageNumber >= numPages}
              style={styles.button}
            >
              Next ➡
            </button>
          </div>


          {selectedText && (
            <div style={styles.selectionBox}>
              <strong>Selected:</strong> {selectedText}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;









































































