"use client";
import "../../flow/config";
import { useEffect, useMemo, useState } from "react";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/navigation";
import { Button, ChakraProvider, Menu, MenuButton, MenuItem, MenuList, Spinner, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import axios from "axios";
import { checkIsInitialized, getOwnedDocs } from "@/flow/scripts";
import { createDoc, initializeAccount } from "@/flow/transactions";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#e5e5e5",
  borderStyle: "dashed",
  backgroundColor: "#ffffff",
  color: "#a3a3a3",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Home() {
  const toast = useToast();
  const router = useRouter();
  const [user, setUser] = useState();
  const [processing, setProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [docs, setDocs] = useState([]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    multiple: false,
    accept: "application/pdf",
    onDrop: async (f) => {
      if (f[0]?.type !== "application/pdf") {
        return toast({
          title: `File type is not allowed. Only PDF is accepted!`,
          status: "error",
          isClosable: true,
        });
      }
      setProcessing(true);

      // Process upload file
      let ipfsHash = "";
      const fileId = new Date().toTimeString();
      const formData = new FormData();
      formData.append("file", f[0]);
      formData.append(
        "pinataMetadata",
        JSON.stringify({
          name: fileId,
        })
      );
      formData.append(
        "pinataOptions",
        JSON.stringify({
          cidVersion: 0,
        })
      );
      try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        });

        ipfsHash = res.data.IpfsHash;
      } catch (error) {
        setProcessing(false);
        return toast({
          title: `Failed to upload your docs. Try again`,
          status: "error",
          isClosable: true,
        });
      }

      // Processing embeddings file
      await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          slug: ipfsHash,
          url: `https://ipfs.io/ipfs/${ipfsHash}`,
        }),
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      await createNewDoc(f[0].name, ipfsHash);
      await fetchMyDocs();
      setProcessing(false);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => fcl.currentUser.subscribe(setUser), []);
  useEffect(() => {
    if (user?.loggedIn !== undefined && user?.loggedIn !== true) {
      return router.push("/");
    }

    if (user?.addr) {
      checkInit();
    }
  }, [user, router]);

  useEffect(() => {
    if (isInitialized) {
      fetchMyDocs();
    }
  }, [isInitialized]);

  async function createNewDoc(name, ipfsHash) {
    try {
      const txId = await createDoc(name, ipfsHash);
      await fcl.tx(txId).onceSealed();
    } catch (error) {
      return toast({
        title: error?.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  async function fetchMyDocs() {
    try {
      const docs = await getOwnedDocs(user.addr);
      setDocs(docs);
    } catch (error) {
      return toast({
        title: error?.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  const checkInit = async () => {
    const isInit = await checkIsInitialized(user.addr);
    setIsInitialized(isInit);
  };

  async function initialize() {
    setProcessing(true);
    try {
      const txId = await initializeAccount();
      await fcl.tx(txId).onceSealed();
      await checkInit();
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      return toast({
        title: error,
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <ChakraProvider>
      <main className="bg-neutral-100 min-h-screen">
        <nav className="bg-white h-16 shadow flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <Link href="/">
                <img src="/img/documinds-dark.webp" alt="Logo" className="h-4" />
              </Link>
              <div>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {user?.addr}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => fcl.unauthenticate()}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>
        </nav>

        <section className="py-8">
          <div className="container mx-auto px-6">
            {!isInitialized ? (
              <div className="text-center">
                <p className="font-bold text-2xl">Your account has not been initialized yet</p>
                <button onClick={initialize} className="px-5 py-2.5 bg-lime-500 rounded font-bold mt-4">
                  Initialize Account
                </button>
              </div>
            ) : (
              <>
                <h1 className="font-bold text-2xl mb-2 text-neutral-700">Upload Your Doc</h1>

                <div className="mb-6">
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>Drag n drop some files here, or click to select files</p>
                  </div>
                </div>

                <h2 className="font-bold text-2xl mb-2 text-neutral-700">My Docs</h2>

                <div className="grid grid-cols-4 gap-6">
                  {docs.map((i) => (
                    <Link key={i.id} href={`/chat/${i.ipfsHash}`} className="w-full bg-white p-4 shadow rounded-md">
                      {i.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {processing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center">
          <div className="text-center">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
            <p className="text-white">Processing...</p>
          </div>
        </div>
      )}
    </ChakraProvider>
  );
}
