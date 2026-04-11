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
    <div style={styles.container}>
      
      <h1 style={styles.header}>📄 Smart PDF Viewer</h1>


      <div style={styles.uploadBox}>
        <input
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









































































const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },

  header: {
    marginBottom: "20px",
    color: "#333",
  },

  uploadBox: {
    background: "#fff",
    padding: "15px 20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },

  viewer: {
    width: "100%",
    maxWidth: "900px",
    height: "80vh",
    overflow: "auto",
    background: "#eaeaea",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  pageWrapper: {
    display: "flex",
    justifyContent: "center",
  },

  controls: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  button: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    background: "#4a90e2",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "500",
  },

  pageInfo: {
    fontWeight: "bold",
  },

  selectionBox: {
    marginTop: "20px",
    background: "#fff3cd",
    padding: "12px",
    borderRadius: "8px",
    maxWidth: "900px",
    width: "100%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};