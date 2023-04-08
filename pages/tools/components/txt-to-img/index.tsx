/* eslint-disable max-len */
import {
  useEffect, useState, useRef, LegacyRef,
} from 'react';

export default function TxtToImg() {
  const imgs = useRef<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef: LegacyRef<HTMLTextAreaElement> | null = useRef(null);
  const [fetchCtrl, setController] = useState(null);
  const handleButtonClick = async () => {
    setLoading(true);
    const controller = new AbortController();

    setController(controller);

    const { signal } = controller;

    const response = await fetch('http://170.106.168.8:3335/zyj/mj', {
      method: 'POST',
      body: JSON.stringify({
        messages: inputRef.current.value,
      }),
      headers: {
        Authorization: 'coln',
      },
      signal,
    });
    console.log({ response });
    setLoading(false);
  };

  useEffect(() => {
    console.log(1111);
    const ws = new WebSocket('ws://170.106.168.8:53020');
    ws.onopen = function () {
      console.log('websocket is connected ...');
      // 发送消息给服务端
      ws.send('hello server');
    };
    ws.onmessage = (ev) => {
      console.log(ev.data);
      if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(ev.data)) {
        console.log(imgs);
        imgs.current = [...imgs.current, ev.data];
      }
    };
    return () => {
      ws.close();
    };
  }, []);
  console.log({ imgs });
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
            disabled={loading}
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
            disabled={loading}
            className={`h-12 px-4 py-2 bg-slate-400 text-slate-400 rounded-sm bg-opacity-10 ${loading ? 'hover:bg-opacity-20' : ''}`}
          >
            发送
          </button>
        </div>
      </div>
      {
        loading && <div className="h-12 mb-4 flex items-center justify-center bg-slate bg-opacity-10 text-slate rounded-sm">绞尽脑汁思考中...<div className="border-[#343a47] ml-4 p-1 px-2 rounded-sm border border-solid cursor-pointer "
        onClick={() => {
          fetchCtrl?.abort();
          setLoading(false);
        }}>停止思考</div></div>
      }
    </div>
    <div className="flex">
      {
        // eslint-disable-next-line @next/next/no-img-element
        imgs.current.map((v, i) => <img
          key={i}
          className="max-h-[300px] mr-4 object-cover"
          src={v}
          alt=""
        />)
      }
    </div>
  </div>;
}
