import { OpenAIStream, OpenAIStreamPayload } from '@/utils/openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request): Promise<Response> {
  const { messages } = (await req.json()) as {
    messages?: any;
  };
  console.log({ messages });

  if (!messages) {
    return new Response('No messages in the request', { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
