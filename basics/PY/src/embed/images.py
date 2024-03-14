import boto3
import json
import base64
client = boto3.client(service_name='bedrock-runtime', region_name="us-west-2")

images = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
]

def getImagesEmbedding(imagePath: str):
    with open(imagePath, "rb") as f:
        base_image = base64.b64encode(f.read()).decode("utf-8")

    response = client.invoke_model(
        body=json.dumps({
            "inputImage": base_image,
        }), 
        modelId='amazon.titan-embed-image-v1', 
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

imagesWithEmbeddings = []

for image in images:
    imagesWithEmbeddings.append({
        'path': image,
        'embedding': getImagesEmbedding(image)
    })

test_image = 'images/cat.png'

test_image_embedding = getImagesEmbedding(test_image)

similarities = []

for image in imagesWithEmbeddings:
    similarities.append({
        'path': image['path'],
        'similarity': cosineSimilarity(image['embedding'], test_image_embedding)
    })

similarities.sort(key=lambda x: x['similarity'], reverse=True)

print(f"Similarities of '{test_image}' with:")
for similarity in similarities:
    print(f"  '{similarity['path']}': {similarity['similarity']:.2f}")
