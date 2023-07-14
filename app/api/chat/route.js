import { Configuration, OpenAIApi } from 'openai-edge';
import { PineconeClient } from "@pinecone-database/pinecone";
import { StreamingTextResponse, OpenAIStream } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req) {
  const { messages, slug } = await req.json();

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex });
	const search = await vectorStore.similaritySearch("Ringkaskan isi dari dokumen ini", 5, {
		slug: slug
	});
	let context = search.map(item => item.pageContent);
	context = context.join("\n\n--\n\n");
	
	const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    max_tokens: 12000,
    temperature: 0.6,
    messages: [
        {
          role: "system",
          content: `Answer the question based on the context below. If the answer not include in context, anser with "I'm sorry, but I don't understand what you mean. Can you please provide more context or clarify your question?:
					${context}`
        },
        ...messages,
      ],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
