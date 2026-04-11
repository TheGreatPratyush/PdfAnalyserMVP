import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ Worker setup (Vite compatible)
import worker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function App() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* 🔥 Header */}
      <h1 style={{ marginBottom: "20px", color: "#333" }}>
        📄 Smart PDF Viewer
      </h1>

      {/* 📤 Upload Box */}
      <div
        style={{
          background: "#fff",
          padding: "15px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              setFile(f);
              setPageNumber(1);
            }
          }}
        />
      </div>

      {/* 📖 PDF Viewer */}
      {file && (
        <>
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "80vh",
              overflow: "auto",
              background: "#eaeaea",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Page pageNumber={pageNumber} width={800} />
              </div>
            </Document>
          </div>

          {/* 🎮 Controls */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber <= 1}
              style={btnStyle}
            >
              ⬅ Prev
            </button>

            <span style={{ fontWeight: "bold" }}>
              Page {pageNumber} / {numPages}
            </span>

            <button
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={pageNumber >= numPages}
              style={btnStyle}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// 🎨 Button Style
const btnStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#4a90e2",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "500",
};

export default App;