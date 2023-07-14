"use client";
import "../../../flow/config";
import { useState } from "react";
import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { Button, ChakraProvider, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Home() {
  const params = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      slug: params.id,
    },
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <ChakraProvider>
      <main className="bg-neutral-100 min-h-screen">
        <nav className="bg-white h-16 shadow flex items-center z-10 relative">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <img src="/img/documinds-dark.webp" alt="Logo" className="h-4" />
              </Link>
              <Link href="/" className="px-4 py-2 bg-lime-500 rounded text-sm font-bold">
                Back to Home
              </Link>
            </div>
          </div>
        </nav>

        <section className="h-[calc(100vh_-_4rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-x">
            <div>
              <div className="w-full h-10 bg-neutral-100 flex items-center justify-between px-2 text-sm">
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded border bg-lime-400/20 hover:bg-lime-400 font-bold text-xs" onClick={goToPrevPage}>Prev</button>
                  <button className="px-2 py-1 rounded border bg-lime-400/20 hover:bg-lime-400 font-bold text-xs" onClick={goToNextPage}>Next</button>
                </div>
              </div>
              <div className="h-[calc(100vh_-_6.5rem)] overflow-hidden">
                <Document file={`https://ipfs.io/ipfs/${params.id}`} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} />
                </Document>
              </div>
            </div>
            <div className="bg-white h-full flex flex-col">
              <div className="h-[calc(100vH_-_9rem)] overflow-y-auto">
                {messages.map((m) => (
                  <div key={m.id}>
                    {m.role === "user" ? (
                      <div className="flex items-start gap-2 p-4 bg-white">
                        <div className="shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>{m.content}</div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-4 bg-neutral-100">
                        <div className="shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>{m.content}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="shrink-0 h-20 bg-neutral-100 flex items-center p-4 border-t">
                <form onSubmit={handleSubmit} className="relative w-full">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="w-full border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
                    placeholder="Enter your question"
                  />
                  <button type="submit" className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ChakraProvider>
  );
}
