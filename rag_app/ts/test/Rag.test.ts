import {handler } from '../services/Rag'

const event = {
    body: JSON.stringify({
        question: "What does GDPR stand for?"
    })
}

async function testRag() {
    const response = await handler(event as any, {} as any)
}

testRag()