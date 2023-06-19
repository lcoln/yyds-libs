/* eslint-disable camelcase */
import request from '@/utils/request';

export async function getMjImg(): Promise<any> {
  const res = await request.post('/zyj/mj');
  return res.data;
}

export async function chatgpt(params: any): Promise<any> {
  const res = await request.post('http://localhost:3000/api/generate', params);
  return res.data;
}
