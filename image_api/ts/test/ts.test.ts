import { handler } from '../services/image'

async function testImage() {
    const result = await handler({
        body: JSON.stringify({ description: 'an image of a cat with an umbrella at night' })
    } as any, {} as any)
    console.log(result)
}

testImage()