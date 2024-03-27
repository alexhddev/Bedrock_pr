import { handler } from '../image/image'

async function testImage() {
    const result = await handler({
        body: JSON.stringify({ description: 'a car chase in the sunset' })
    } as any, {} as any)
    console.log(result)
}

testImage()