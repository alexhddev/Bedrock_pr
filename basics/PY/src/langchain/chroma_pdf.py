from langchain_community.llms import Bedrock
from langchain_community.embeddings import BedrockEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import boto3

AWS_REGION = "us-west-2"

bedrock = boto3.client(service_name="bedrock-runtime", region_name=AWS_REGION)

model = Bedrock(model_id="amazon.titan-text-express-v1", client=bedrock)

bedrock_embeddings = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v1", client=bedrock
)

question = "What themes does Gone with the Wind explore?"


def load_and_store():
    loader = PyPDFLoader("assets/books.pdf")
    splitter = RecursiveCharacterTextSplitter(separators=["\n"])
    docs = loader.load()
    splitted_docs = splitter.split_documents(docs)
    vector_store = Chroma.from_documents(
        splitted_docs,
        embedding=bedrock_embeddings,
        collection_name="books",
    )
    vector_store.persist()
    return vector_store


def query_store(vector_store):
    retriever = vector_store.as_retriever(
        search_kwargs={"k": 2}  # maybe we can add a score threshold here?
    )
    results = retriever.get_relevant_documents(question)
    results_string = []
    for result in results:
        results_string.append(result.page_content)

    template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Answer the users question based on the following context: {context}",
            ),
            ("user", "{input}"),
        ]
    )
    chain = template.pipe(model)

    response = chain.invoke({"input": question, "context": results_string})
    print(response)


vector_store = load_and_store()
# vector_store = Chroma(
#     embedding_function=bedrock_embeddings,
#     collection_name="books",
# )
query_store(vector_store)
