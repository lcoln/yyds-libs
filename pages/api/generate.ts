import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai-streams/node';

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await OpenAI('completions', {
    model: 'gpt-3.5-turbo',
    prompt: 'Write a happy sentence.\n\n',
    max_tokens: 25,
  });
  console.log({ stream });

  stream.pipe(res);
}
