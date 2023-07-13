import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextResponse } from "next/server";
import { Document } from "langchain/document";

export const config = {
  api: {
    bodyParser: false,
  }
};

export async function POST(req) {
	const json = await req.json()

  const data = await fetch(json.url).then((res) => res.blob());
  const loader = new PDFLoader(data);
  const docs = await loader.load();

	const newDocs = [];
	docs.map((i) => {
		const meta = i.metadata;
		const docu = new Document({
			pageContent: i.pageContent,
			metadata: {...meta, slug: json.slug}
		});
		newDocs.push(docu);
	});

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
  });

  const output = await splitter.splitDocuments(newDocs);

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  await PineconeStore.fromDocuments(output, new OpenAIEmbeddings(), {
    pineconeIndex,
  });

  return new NextResponse("Success")
}
