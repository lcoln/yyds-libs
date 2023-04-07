/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-19 19:20:48
 */
import type { NextPage } from 'next';
import Image from 'next/image';
import { createSignal } from 'solid-js';

import styles from './index.module.css';

const tabsIcon = [{
  title: '学习',
  icon: 'icon-xuexi',
  tabs: [{
    title: '学习',
    subTitle: '我是你各个科目的课代表哦~',
    img: '/img/1.png',
  }],
}, {
  title: '生活',
  icon: 'icon-xuexi',
}, {
  title: '编程',
  icon: 'icon-xuexi',
}, {
  title: '设计',
  icon: 'icon-xuexi',
}];

const OAI: NextPage = () => {
  const [currTab, setTab] = createSignal(0);

  return <div className="flex flex-col mt-8" >
    <section className="flex">
      {
        tabsIcon.map((v, i) => <div
          key={v.title}
          className={`
            flex flex-col itmes-center justify-center h-[50px] mr-6 text-center
            cursor-pointer hover:text-[#D34016] transition text-gray-500
            ${currTab() === i ? 'text-[#D34016]' : ''}
          `}
        >
          <span className={`iconfont ${v.icon} text-2xl`}></span>
          <span className="mt-1 text-xs">{v.title}</span>
        </div>)
      }
    </section>
    <section className="flex flex-col mt-8">
      {
        tabsIcon[currTab()].tabs?.map((v, i) => <div
          key={v.title}
          className={`flex flex-col itmes-center justify-center w-[300px] text-center
          cursor-pointer transition text-gray-500 
          `}
        >
          <Image
            src={v.img}
            alt="aa"
            className="flex-2 rounded-lg object-cover"
            width="300"
            height="300"
          />
          <div className="flex flex-col mt-1 text-left">
            <span className="text-xs mt-2 font-black">{v.title}</span>
            <span className="text-xs mt-2">{v.subTitle}</span>
          </div>
        </div>)
      }
    </section>
  </div>;
};

export default OAI;
