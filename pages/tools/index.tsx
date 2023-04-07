/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-07 22:36:04
 */
import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import styles from './index.module.css';

const data = [
  {
    key: '1',
    label: 'Tab 1',
    children: '',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];
const Tools: NextPage = () => {
  const ref = useRef<any>(null);
  useEffect(() => {
    ref?.current?.addEventListener('change', (ev) => {
      console.log(ev);
    });
    // document.addEventListener
  }, []);
  return <div className={styles.container}>
    N款实用小工具，任君挑选
    {/* <wc-tab
      data={JSON.stringify(data)}
      color="#D34017"
      ref={ref}
    >
    </wc-tab> */}
  </div>;
};

export default Tools;
