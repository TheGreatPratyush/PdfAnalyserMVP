import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import MakrImp from "./makrImp";


// Worker setup (Vite)
import worker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = worker;

function Landing() {
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
        <div className="relative min-h-screen w-full bg-gradient-to-br from-orange-200 to-orange-500 flex flex-col items-center">

            <div className="w-full max-w-5xl px-4 space-y-6">
                <div className="absolute grid justify-center mt-37 ml-150 border-t-4 border-l-4 border-b-1 border-r-1 p-2 ">
                < MakrImp />
                </div>
                <div className="text-center py-6">
                    <h1 className="text-black text-4xl font-bold tracking-tight">
                        Smart PDF Viewer
                    </h1>
                    <p className="text-gray-700 mt-2">
                        Upload, view, and select text from your PDFs
                    </p>
                </div>

                <div className="flex justify-center">
                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 transition backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 shadow-lg">
                        <span className="text-sm text-black font-medium">Upload PDF</span>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files[0];
                                if (f) {
                                    setFile(f);
                                    setPageNumber(1);
                                    setSelectedText("");
                                }
                            }}
                        />
                    </label>
                </div>

                {file && (
                    <>
                        <div className="flex justify-center">
                            <div
                                ref={pdfRef}
                                onMouseUp={handleSelection}
                                className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-4"
                            >
                                <Document
                                    file={file}
                                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        width={Math.min(800, window.innerWidth - 40)}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-6">
                            <button
                                onClick={() => setPageNumber((p) => p - 1)}
                                disabled={pageNumber <= 1}
                                className="z-20 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 transition text-black"
                            >
                                ⬅ Prev
                            </button>

                            <span className="z-20 text-black font-medium">
                                Page {pageNumber} / {numPages}
                            </span>

                            <button
                                onClick={() => setPageNumber((p) => p + 1)}
                                disabled={pageNumber >= numPages}
                                className="z-20 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 transition text-black"
                            >
                                Next ➡
                            </button>
                        </div>
                        {selectedText && (
                            <div className="flex justify-center">
                                <div className="max-w-2xl w-full bg-white/30 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg">
                                    <p className="text-sm text-gray-700 mb-1">Selected Text</p>
                                    <p className="text-black">{selectedText}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}

export default Landing;