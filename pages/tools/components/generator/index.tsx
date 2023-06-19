/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2023-04-07 23:48:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-18 22:45:07
 */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import {
  shortPrompt,
  filters,
  langs,
  formats,
  codeFormats,
  createPromptMap,
  textToImageParams,
} from '@/utils/constants';
import React, { LegacyRef, useRef, useState } from 'react';
import type { ChatMessage } from '@/types';
import { chatgpt } from '@/model/ai';
import MessageItem from './messageItem';
import IconClear from './icons/Clear';
import LoadingSvg from './loading';

const Filter = (
  {
    title, setSelect, children, className, data, disabled, select, more,
  }: {
    title?: string,
    setSelect?: Function,
    children?: any,
    className?: string,
    data?: string[]
    disabled?: Function
    select?: string
    more?: boolean
  },
) => {
  const [index, setCurr] = useState(select ? data.indexOf(select) : (data?.[0] === '默认' ? 0 : ''));

  return <div className={`relative p-2.5 pt-[13px] border-2 border-[#D34017] select-none ${className}`}>
    <span className="absolute top-[-10px] left-[-10px] py-px px-1 shadow-[0_1px_3px_0_black] bg-[#6B4423] filter-title">{title}</span>
    <div>
      {
        children || data?.map((message, i) => <div
        key={i}
        className={
          [
            i === index
              ? 'bg-[#D34017] border-[#D34017]' : (index >= 0 ? 'bg-opacity-20]' : ''),
            // 'border-gray-300',
            i === index ? '' : 'hover:bg-gray-800',
            disabled?.() ? 'opacity-30 cursor-not-allowed' : '',
            'inline-block',
            'p-2',
            'mr-2',
            'mt-2',
            'border',
            'border-solid',
            'border-slate-400',
            'cursor-pointer',
            'rounded-sm',
          ].join(' ')
        }

        onClick={() => {
          if (disabled?.()) {
            return;
          }
          if (setSelect) {
            if (data?.[0] === '默认') {
              setSelect(message);
              setCurr(i);
            } else {
              setSelect(i === index ? '' : message);
              setCurr(i === index ? '' : i);
            }
          }
        }}
      >
        {message}
      </div>)
      }
      {
        more && <div className="inline-block py-2 px-4 mr-2 mt-2 border border-dashed cursor-pointer rounded-sm border-[#343a47]" >+</div>
      }
    </div>
  </div>;
};

const FormatTransform = (
  {
    title,
    data,
    action,
    select,
    type,
  }: {
    title: string,
    data: any[],
    action: Function,
    select: string,
    type?: string
  },
) => {
  const ref = null;
  const [loading, setLoading] = useState<boolean>(false);
  return <div className="flex max-w-[320px] items-center justify-between mt-2 outline-none">
      <span>{title}</span>
      <div className="inline-block ml-4 p-2 align-middle bg-[#292D37]">
        {
          type === 'upload' ? <form
            action="/upload"
            method="post"
            encType="multipart/form-data"
          >
            <div onClick={() => {
              ref.click();
            }} className="w-[25px] text-center">
              {
                loading ? <LoadingSvg /> : '+'
              }
            </div>
            <input
              type="file"
              id="file"
              name="file"
              hidden
              ref={ref}
              accept=".doc,.docx,.ppt,.pptx,.xlsx"
              onChange={async (file) => {
                setLoading(true);
                const fd = new FormData();
                fd.append('file', file.target.files[0]);
                const response = fetch('http://170.106.168.8:3335/zyj/readDoc', {
                  method: 'POST',
                  body: fd,
                  headers: {
                    Authorization: 'coln',
                  },
                }).then((v) => {
                  setLoading(false);
                }).catch((e) => {
                  console.log(e);
                  setLoading(false);
                });
              }}
            />
          </form>
            : <select
            onChange={(e) => { action(e.target.value); }}
            className="min-w-[116px] bg-transparent outline-none"
            value={select}
          >
            {
              data.map((message, i) => <option key={i} value={message}>{message}</option>)
            }
          </select>
        }
      </div>
    </div>;
};

export default function Generator() {
  // onMount(() => console.log(11111));
  const inputRef: LegacyRef<HTMLTextAreaElement> | null = useRef(null);
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState(filters[0]);
  const [lang, setLang] = useState(langs[0]);
  const [fetchCtrl, setController] = useState(null);
  const [format, setFormat] = useState(formats[0]);
  const [codeFormat, setCodeFormat] = useState(codeFormats[0]);
  const [shortP, setShortPrompt] = useState('');

  const filterCompMap: { [key: string]: React.ReactNode} = {
    代码: <Filter title="输出格式" className="mt-8">
      <FormatTransform
        title="请选择需要转化的格式"
        data={codeFormats}
        select={codeFormat}
        action={setCodeFormat}
      />
    </Filter>,
    other: <Filter title="输出格式" className="mt-8">
      <FormatTransform
        title="请选择翻译语种"
        data={langs}
        select={lang}
        action={setLang}
      />
      <FormatTransform
        title="请选择需要转化的格式"
        data={formats}
        select={format}
        action={setFormat}
      />
    </Filter>,
    文档总结: <Filter title="输出格式" className="mt-8">
      <FormatTransform
        title="请上传文件(ppt/pdf/xlsx/doc)"
        data={codeFormats}
        select={codeFormat}
        action={setCodeFormat}
        type="upload"
      />
    </Filter>,
  };

  const outputStream = async (data, updateAssistant = true) => {
    const reader = data.getReader();
    const decoder = new TextDecoder('utf-8');

    let done = false;
    // 获取文档内容的高度
    let docHeight = document.body.scrollHeight;
    // 获取视口的高度
    const viewHeight = window.innerHeight;
    let result = '';
    while (!done) {
      const heightTop = document.documentElement.scrollTop || document.body.scrollTop;
      const shouldUpdateScrollTop = document.body.scrollHeight - viewHeight === heightTop;

      const { value, done: readerDone } = await reader.read();
      console.log({ value });
      if (value) {
        const char = decoder.decode(value);
        if (char === '\n' && currentAssistantMessage.endsWith('\n')) {
          continue;
        }
        console.log({ char, currentAssistantMessage });
        if (char) {
          updateAssistant && setCurrentAssistantMessage(currentAssistantMessage + char);
          result += char;
        }
        if (shouldUpdateScrollTop && docHeight !== document.body.scrollHeight) {
          docHeight = document.body.scrollHeight;
          window.scrollTo(0, docHeight - window.innerHeight);
        }
      }
      done = readerDone;
      // console.log(msgRef(), 8787)
    }
    return result;
  };

  const createParams = () => {
    const inputValue = inputRef?.current?.value;

    // @ts-ignore
    if (window?.umami) umami.trackEvent('chat_generate');

    const list = [
      ...messageList,
    ];

    if (shortP || inputValue) {
      list.push({
        role: 'user',
        content: shortP || inputValue,
        // content: shortP ? shortP : `${inputValue}${select === '代码' ? '' : '请用' + lang() + '回答'}`,
      });
    }

    setMessageList(list);

    const prompt = select;
    // console.log({prompt})
    const promptMap = createPromptMap(lang, format, codeFormat, inputValue);

    const controller = new AbortController();

    setController(controller);

    const { signal } = controller;

    const params = [];

    if (!shortP) {
      if (select !== '默认') {
        params.push({
          role: 'system',
          content: promptMap[prompt] || `请帮我生成${select}`,
        });
      }
      if (select !== '代码') {
        params.push({
          role: 'system',
          content: promptMap['转化格式'],
        }, {
          role: 'system',
          content: promptMap['翻译'],
        });
      }
    }
    return { params, signal };
  };

  const createData = async (params, signal, useMessageList = true, closeLoading = true) => {
    let response = {};

    try {
      response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            ...(useMessageList ? messageList : []),
            ...params,
          ],
        }),
        signal,
      });

      if (!response.ok) {
        closeLoading && setLoading(false);
        alert('网络错误');
        throw new Error(response.statusText);
      }
    } catch (e) {
      console.log(e, 111111111);
    }
    console.log({ response });

    return response.body;
  };

  const createImageData = async (signal: any) => {
    let response: {ok?: boolean, statusText?: string, json?: Function} = {};
    const genPrompt = await createData([
      { role: 'system', content: 'You are a helpful assistant that translates Chinese to English.' },
      { role: 'user', content: `Translate the following Chinese text to English without details and remove symbols: '{${inputRef.current?.value}}'` },
    ], signal, false);
    const genEngPrompt = await outputStream(genPrompt, false);

    try {
      response = await fetch('https://sd.c137.run:8001/sdapi/v1/txt2img', {
        method: 'POST',
        // body: JSON.stringify({
        //   messages: textToImageParams(inputRef.current?.value)
        // }),
        body: JSON.stringify(textToImageParams(genEngPrompt)),
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      if (!response.ok) {
        setLoading(false);
        alert('网络错误');
        throw new Error(response.statusText);
      }
    } catch (e) {
      console.log(e);
    }
    const data = await response?.json?.();
    return data?.images;
  };

  const handleButtonClick = async () => {
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      if (!inputValue.trim() && !shortP) {
        return;
      }
      setLoading(true);
      const { params, signal } = createParams();

      try {
        const data = await createData(params, signal);
        inputRef.current.value = '';

        if (!data) {
          setLoading(false);
          alert('暂无数据');
          throw new Error('No data');
        }

        await outputStream(data);
      } catch (err) { console.log(err); }

      setMessageList([
        ...messageList,
        {
          role: 'assistant',
          content: currentAssistantMessage,
        },
      ]);
      setCurrentAssistantMessage('');
      setLoading(false);
    }
  };

  // text to image
  const handleTTIButtonClick = async () => {
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      if (!inputValue.trim() && !shortP) {
        return;
      }
      setLoading(true);
      const { params, signal } = createParams();
      let data = '';
      try {
        data = await createImageData(signal);
        inputRef.current.value = '';

        if (!data) {
          setLoading(false);
          alert('暂无数据');
          throw new Error('No data');
        }
      } catch (err) { console.log(err); }

      setMessageList([
        ...messageList,
        {
          role: 'assistant',
          content: data,
        },
      ]);

      setCurrentAssistantMessage('');
      setLoading(false);
    }
  };

  const clear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setMessageList([]);
    setCurrentAssistantMessage('');
  };
  const methods: { [key: string]: Function} = {
    文生图: handleTTIButtonClick,
  };
  console.log({ messageList });
  return (<>
    <div className="flex items-end mt-4">
      {/* <div class="border-[#D34017] border-r mr-8"> */}
      <div>
        {/* <Filter title="快捷提问" data={shortPrompt} setSelect={(v) => {
          setShortPrompt(v)
          setMessageList([])
          setCurrentAssistantMessage('')
        }} disabled={loading} select={shortP} /> */}
        {
          !shortP && <>
            <Filter title="prompt模板"
              data={filters} setSelect={(v) => {
                if (v !== select) {
                  setLoading(false);
                  fetchCtrl?.abort();
                  setSelect(v);
                  setMessageList([]);
                  setCurrentAssistantMessage('');
                }
              }}
              select={select}
            />
            {
              filterCompMap[select] ? filterCompMap[select] : ''
            }
            {
              !filterCompMap[select] && select !== '文生图' ? filterCompMap.other : ''
            }
          </>
        }
      </div>
    </div>
    <div className="my-6">
      {/* <div class={shortP ? 'max-h-50vh' : 'max-h-25vh'} overflow-auto overflow-x-hidden ref={setMsgRef}> */}
      <div className="overflow-auto overflow-x-hidden">
        {
          messageList.map((message, i) => <MessageItem
            key={i}
            role={message.role}
            message={message.content}
          />)
        }
        { currentAssistantMessage && <MessageItem role="assistant" message={currentAssistantMessage} /> }
      </div>
      {
        loading && <div className="h-12 my-4 flex items-center justify-center bg-slate bg-opacity-10 text-slate rounded-sm">绞尽脑汁思考中...<div className="border-[#343a47] ml-4 p-1 px-2 rounded-sm border border-solid cursor-pointer "
        onClick={() => {
          const crtl = fetchCtrl;
          crtl?.abort();
          setLoading(false);
        }}>停止思考</div></div>
      }
      <div className="my-4 flex items-center gap-2 input-area">
        {
          !shortP && <textarea
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
                methods[select]
                  ? methods[select]()
                  : handleButtonClick();
              }
            }}
            className="w-full px-4 text-slate-100 rounded-sm bg-slate-300 bg-opacity-10 focus:bg-opacity-20 focus:ring-0 focus:outline-none"
          />
        }
        <div className="btns">
          <button
            title="Clear"
            onClick={clear}
            className="h-12 px-4 py-2 bg-slate-400 hover:bg-opacity-20 text-slate-400 rounded-sm bg-opacity-10"
            disabled={loading}
          >
            <IconClear />
          </button>
          <button onClick={() => {
            methods[select]
              ? methods[select]()
              : handleButtonClick();
          }}
            disabled={loading}
            className="h-12 px-4 py-2 bg-slate-400 hover:bg-opacity-20 text-slate-400 rounded-sm bg-opacity-10"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </>);
}
