"use client";
import "../flow/config";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  if (user?.loggedIn) {
    return router.push("/docs");
  }

  return (
    <main>
      <section className="w-full bg-neutral-900 text-white py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="p-3 border-4 inline-block mb-2 border-white/10">
              <img src="/img/documinds.webp" alt="Logo" className="h-4" />
            </div>
            <h1 className="font-bold text-4xl">The Innovative Platform for Chatting about PDF</h1>
            <p className="mb-4 mt-2 text-white/70">
              Do you want to discuss and share ideas about PDF documents effortlessly? Look no further than DocuMinds! With DocuMinds, you can upload PDF
              documents and engage in fascinating conversations about their content.
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-5 py-2.5 font-medium text-sm hover:bg-lime-500 rounded transition-all bg-lime-400 text-neutral-900"
                onClick={() => fcl.authenticate()}
              >
                Connect Wallet
              </button>
              <button className="px-5 py-2.5 font-medium text-sm hover:text-lime-500 rounded transition-all text-lime-400">Try Demo</button>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-xl border p-6 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-lime-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h4 className="font-bold text-xl mb-2">Upload and Share</h4>
            <p className="text-black/60 leading-normal text-sm">
              Easily upload PDF documents and share them with colleagues, friends, or team members. Let them explore the minds behind the documents and
              participate in inspiring discussions.
            </p>
          </div>
          <div className="bg-white shadow-xl border p-6 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-lime-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h4 className="font-bold text-xl mb-2">Real-Time Chat</h4>
            <p className="text-black/60 leading-normal text-sm">
              Experience real-time and direct chatting through the Documinds platform. Share perspectives, provide feedback, or exchange ideas in real-time.
            </p>
          </div>
          <div className="bg-white shadow-xl border p-6 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-lime-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h4 className="font-bold text-xl mb-2">Blockchain Integration</h4>
            <p className="text-black/60 leading-normal text-sm">
              With our blockchain integration, we provide an extra layer of security and transparency. Your documents are stored securely, promoting trust and
              accountability.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
