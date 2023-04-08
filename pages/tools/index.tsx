/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-08 16:19:37
 */
import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
// import TxtToImg from './components/txt-to-img';

const Generator = dynamic(() => import('./components/generator'), {
  loading: () => <p>Loading...</p>,
});
const TxtToImg = dynamic(() => import('./components/txt-to-img'), {
  loading: () => <p>Loading...</p>,
});

const data = [
  {
    key: '1',
    label: '速答模板',
    children: Generator,
  },
  {
    key: '2',
    label: '文生图',
    children: TxtToImg,
  },
  {
    key: '3',
    label: 'Tab 3',
    children: '',
  },
];
const childs: {[key: number]: React.ReactNode} = {
  0: <Generator />,
  1: <TxtToImg />,
  2: '222222',
};
const Tools: NextPage = () => {
  const ref = useRef<any>(null);
  const [index, setCurr] = useState(0);
  const Comp = childs[index];
  useEffect(() => {
    ref?.current?.addEventListener('change', ({ idx }: {idx: string}) => {
      console.log(idx);
      setCurr(Number(idx) - 0);
    });
    // document.addEventListener
  }, []);
  return <div className="p-10 pt-20">
    <wc-tab
      data={JSON.stringify(data)}
      color="#D34017"
      ref={ref}
    >
    </wc-tab>
    {Comp}
  </div>;
};

export default Tools;
