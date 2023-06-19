/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
import {
  useEffect, useState, useRef, LegacyRef,
} from 'react';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import { getMjImg } from '@/model/ai';

let ws: WebSocket | null = null;
const md = MarkdownIt().use(mdKatex).use(mdHighlight);
export default function TxtToImg() {
  // const imgs = useRef<string[]>([]);
  const [imgs, setImgs] = useState<{url: string, content: string}[]>([]);
  const [status, setStatus] = useState('');
  const inputRef: LegacyRef<HTMLTextAreaElement> | null = useRef(null);
  const [fetchCtrl, setController] = useState(null);
  const handleButtonClick = async () => {
    console.log(inputRef.current.value);
    // CLOSED
    if (!ws || ws.readyState === 3) {
      ws = new WebSocket('ws://43.153.8.12:53020');
    }
    setStatus('pending');
    const controller = new AbortController();

    setController(controller);

    const { signal } = controller;
    // const translateValue = await fetch(, )
    const response = await getMjImg({
      messages: inputRef.current.value,
    });
    console.log({ response });
    // const response = await fetch('http://43.153.8.12:3335/zyj/mj', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     messages: inputRef.current.value,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'coln',
    //   },
    //   signal,
    // });
    if (response.status === 200) {
      setStatus('onqueue');
    } else {
      setStatus('');
    }
    console.log({ response });
  };

  useEffect(() => () => {
    console.log('close');
    ws?.close();
  }, []);

  useEffect(() => {
    if (!ws || ws.readyState === 3) {
      ws = new WebSocket('ws://43.153.8.12:53020');
    }
    ws.onmessage = (ev) => {
      let result: {url?: string, content?: string} = {};
      try {
        result = JSON.parse(ev.data);
        console.log({ result });
        if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(result.url)) {
          // imgs.current = [...imgs.current, ev.data];
          setImgs([...imgs, result]);
          setStatus('done');
          console.log(imgs, status, 1111);
        }
      } catch (e) {}
    };
    console.log({ imgs, status, s: ws.readyState });
  }, [imgs]);
  return <div className="flex flex-col">

    <div>
      <div className="mb-4 flex items-center gap-2 input-area">
        {
          <textarea
            ref={inputRef!}
            id="input"
            placeholder="请输入内容..."
            autoComplete="off"
            autoFocus
            disabled={status === 'pending'}
            onKeyDown={(e) => {
              if (e.shiftKey) {
                return;
              }
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                if (inputRef.current) {
                  inputRef.current.value += '\n';
                }
                return;
              }
              if (e.key === 'Enter' && !e.isComposing) {
                handleButtonClick();
              }
            }}
            className="w-full px-4 text-slate-100 rounded-sm bg-slate-300 bg-opacity-10 focus:bg-opacity-20 focus:ring-0 focus:outline-none"
          />
        }
        <div className="btns">
          <button onClick={handleButtonClick}
            disabled={status === 'pending'}
            className={`h-12 px-4 py-2 bg-slate-400 text-slate-400 rounded-sm bg-opacity-10 ${status ? 'hover:bg-opacity-20' : ''}`}
          >
            {
              status === 'pending'
                ? <wc-icon name="loading" size="m"></wc-icon>
                : '发送'
            }
          </button>
        </div>
      </div>
      <div className="h-12 mb-4 flex items-center justify-center bg-slate bg-opacity-10 text-slate rounded-sm">
        {
          status === 'pending' && '正在发送请求，请稍后...'
        }
        {
          status === 'onqueue' && '已发送成功，正在等待队列执行...'
        }
        {
          status === 'pending' && <div className="border-[#343a47] ml-4 p-1 px-2 rounded-sm border border-solid cursor-pointer "
          onClick={() => {
            fetchCtrl?.abort();
            setStatus('stop');
          }}>
            停止请求
          </div>
        }
      </div>
    </div>
    <div className="flex mr-4">
      {
        imgs.map((v: {url: string, content: string}, i) => <div
          className="flex flex-col justify-center"
          key={i}
          >
          <img
            className="max-h-[300px] object-cover"
            src={v.url}
            alt=""
          />
          <div
            className="mt-4 text-center"
            dangerouslySetInnerHTML={{ __html: md.render(v.content) }}
          ></div>
        </div>)
      }
    </div>
  </div>;
}
