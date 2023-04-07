/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-08 03:04:29
 */
import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import Generator from './components/generator';

const data = [
  {
    key: '1',
    label: '速答模板',
    children: '',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: '',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: '',
  },
];
const childs: {[key: number]: React.ReactNode} = {
  0: <Generator />,
  1: '11111',
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
  return <div className="p-10 pt-16">
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
