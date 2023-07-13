"use client";
import { useEffect, useMemo, useState } from "react";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/navigation";
import { Button, ChakraProvider, Menu, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";

const SAMPLE = [
  { id: 1, title: "Testing" },
  { id: 2, title: "Testing" },
  { id: 3, title: "Testing" },
  { id: 4, title: "Testing" },
];

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

  const { acceptedFiles, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    multiple: false,
    accept: "application/pdf",
    onDrop: (f) => {
      if (f[0]?.type !== "application/pdf") {
        return toast({
          title: `File type is not allowed. Only PDF is accepted!`,
          status: 'error',
          isClosable: true,
        });
      }

      // Process upload file
      console.log(f[0]);
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
  }, [user, router]);

  return (
    <ChakraProvider>
      <main className="bg-neutral-100 min-h-screen">
        <nav className="bg-white h-16 shadow flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <img src="/img/documinds-dark.webp" alt="Logo" className="h-4" />
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
            <h1 className="font-bold text-2xl mb-2 text-neutral-700">Upload Your Doc</h1>

            <div className="mb-6">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag n drop some files here, or click to select files</p>
              </div>
            </div>

            <h2 className="font-bold text-2xl mb-2 text-neutral-700">My Docs</h2>

            <div className="grid grid-cols-4 gap-6">
              {SAMPLE.map((i) => (
                <div key={i.id} className="w-full bg-white p-4 shadow rounded-md">
                  {i.title}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </ChakraProvider>
  );
}
