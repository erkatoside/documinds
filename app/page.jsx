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
              <button className="px-5 py-2.5 font-medium text-sm hover:bg-lime-500 rounded transition-all bg-lime-400 text-neutral-900" onClick={() => fcl.authenticate()}>Connect Wallet</button>
              <button className="px-5 py-2.5 font-medium text-sm hover:text-lime-500 rounded transition-all text-lime-400">Try Demo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
