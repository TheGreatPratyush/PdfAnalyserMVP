import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker setup (Vite)
import worker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function App() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedText, setSelectedText] = useState("");

  const pdfRef = useRef(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) return;

    const isInside =
      pdfRef.current?.contains(selection.anchorNode) &&
      pdfRef.current?.contains(selection.focusNode);

    if (!isInside) return;

    setSelectedText(text);
  };

  return (
    <div>
      <h1>📄 Smart PDF Viewer</h1>

      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              setFile(f);
              setPageNumber(1);
              setSelectedText("");
            }
          }}
        />
      </div>

      {file && (
        <>
          <div ref={pdfRef} onMouseUp={handleSelection}>
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <div>
                <Page
                  pageNumber={pageNumber}
                  width={800}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </div>
            </Document>
          </div>

          <div>
            <button
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber <= 1}
            >
              ⬅ Prev
            </button>

            <span>
              Page {pageNumber} / {numPages}
            </span>

            <button
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={pageNumber >= numPages}
            >
              Next ➡
            </button>
          </div>

          {selectedText && (
            <div>
              <strong>Selected:</strong> {selectedText}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;