import type { Accessor } from 'solid-js';
import type { ChatMessage } from '@/types';
import MarkdownIt from 'markdown-it';
// @ts-ignore
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';

interface Props {
  role: ChatMessage['role']
  message: Accessor<string> | string
}

const isArray = (obj) => Object.prototype.toString.call(obj) === '[object Array]';

// type 1: msg 2: image
export default function MessageItem({ role, message }: Props) {
  const roleClass = {
    system: 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300',
    user: 'bg-gradient-to-r from-purple-400 to-yellow-400',
    assistant: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-300',
  };
  const htmlString = () => {
    const md = MarkdownIt().use(mdKatex).use(mdHighlight);
    if (typeof message === 'function') {
      const res = message();
      if (isArray(res)) {
        return res.map((v) => `<img src="data:image/png;base64,${v}" />`).join();
      }
      // console.log(res)
      return md.render(res);
    } if (typeof message === 'string') {
      // console.log({message})
      return md.render(message);
    } if (isArray(message)) {
      return message.map((v) => `<img src="data:image/png;base64,${v}" />`).join();
    }
    return '';
  };
  return (
    <div className="flex py-2 gap-3 -mx-4 px-4 rounded-lg transition-colors md:hover:bg-slate/3 opacity-75">
      <div className={ `shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}` }></div>
      <div className="message prose text-slate break-words overflow-hidden" innerHTML={htmlString()} />
    </div>
  );
}