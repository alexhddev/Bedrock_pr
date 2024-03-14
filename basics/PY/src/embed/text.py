import boto3
import json
client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")

facts = [
    'The first computer was invented in the 1940s.',
    'John F. Kennedy was the 35th President of the United States.',
    'The first moon landing was in 1969.',
    'The capital of France is Paris.',
    'Earth is the third planet from the sun.',
]

def getEmbedding(input: str):
    response = client.invoke_model(
        body=json.dumps({
            "inputText": input,
        }), 
        modelId='amazon.titan-embed-text-v1', 
        accept='application/json', 
        contentType='application/json')

    response_body = json.loads(response.get('body').read())
    return response_body.get('embedding')

def dotProduct(embedding1: list, embedding2: list):
    return sum([embedding1[i] * embedding2[i] for i in range(len(embedding1))])

def cosineSimilarity(embedding1: list, embedding2: list):
    dotProductValue = dotProduct(embedding1, embedding2)
    magnitude1 = dotProduct(embedding1, embedding1) ** 0.5
    magnitude2 = dotProduct(embedding2, embedding2) ** 0.5
    return dotProductValue / (magnitude1 * magnitude2)

factsWithEmbeddings = []

for fact in facts:
    factsWithEmbeddings.append({
        'text': fact,
        'embedding': getEmbedding(fact)
    })

newFact = 'The first moon landing was in 1969.'
newFactEmbedding = getEmbedding(newFact)

similarities = []

for fact in factsWithEmbeddings:
    similarities.append({
        'text': fact['text'],
        'similarity': cosineSimilarity(fact['embedding'], newFactEmbedding)
    })

print(f"Similarities for fact: '{newFact}' with:")
similarities.sort(key=lambda x: x['similarity'], reverse=True)
for similarity in similarities:
    print(f"  '{similarity['text']}': {similarity['similarity']:.2f}")