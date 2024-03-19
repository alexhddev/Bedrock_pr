import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { Bedrock } from "@langchain/community/llms/bedrock";
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const AWS_REGION = 'us-west-2'

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
})

const embeddings = new BedrockEmbeddings({
    region: AWS_REGION
})

const chromaConfig =         {
    collectionName: 'books',
    url: 'http://localhost:8000'
}

const question = "What themes does Gone with the Wind explore?";

async function main() {

    // const vectorStore = await loadAndStore();

    const vectorStore = await Chroma.fromExistingCollection(
        embeddings,
        chromaConfig
    )

    await queryStore(vectorStore);
}

async function loadAndStore(){
    // create the loader:
    const loader = new PDFLoader('assets/books.pdf', {
        splitPages: false
    });
    const docs = await loader.load();

    // split the docs:
    const splitter = new RecursiveCharacterTextSplitter({
        separators: [`. \n`]
    });

    const splittedDocs = await splitter.splitDocuments(docs);

    // store the data
    const vectorStore = await Chroma.fromDocuments(splittedDocs, embeddings, chromaConfig)
    await vectorStore.addDocuments(splittedDocs);

    return vectorStore;
}

async function queryStore(vectorStore: Chroma) {
    const retriever = vectorStore.asRetriever({
        k: 2
    });
    const results = await retriever.getRelevantDocuments(question);
    const resultDocs = results.map(
        result => result.pageContent
    )

    //build template:
    const template = ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultDocs
    });

    console.log(response)
}

main();

