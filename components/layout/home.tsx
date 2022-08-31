/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-25 13:09:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-29 22:21:56
 */
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { loading } from '@/context/common';
import { useAtom } from 'jotai';
import Button from '@/components/button';
import Router from 'next/router';
import styles from './index.module.css';

type menuConstructor = {
  title: string;
  path?: string;
  childs?: menuConstructor[]
}
type navConstructor = {
  title: string;
}

const menuData: {
  [key: string]: menuConstructor[]
} = {
  menu1: [{
    title: '国际化',
    childs: [{
      title: 'web',
      path: 'tools/overseas/web',
    }, {
      title: '游戏端',
      path: 'tools/overseas/game',
    }, {
      title: 'AI',
      path: 'tools/overseas/ai',
    }],
  }, {
    title: '工程化',
    childs: [{
      title: '工程化模板',
      childs: [{
        title: '面向研发人员',
        path: 'tools/project/template/engineer',
      }, {
        title: '面向产品/运营人员',
        path: 'tools/project/template/pd',
      }],
    }, {
      title: '约定式路由',
      childs: [{
        title: 'react',
        path: 'tools/project/router/react',
      }, {
        title: 'vue',
        path: 'tools/project/router/vue',
      }],
    }, {
      title: '组件依赖定位',
      path: 'tools/project/whereis-components',
    }],
  }, {
    title: '工程质量',
    childs: [{
      title: 'test',
    }],
  }, {
    title: '素材辅助管理',
    childs: [{
      title: 'test',
    }],
  }],
  menu2: [{
    title: '跨端',
    childs: [{
      title: '组件库',
      path: 'tech/cross-platform/component',
    }, {
      title: 'flutter',
      path: 'tech/cross-platform/flutter',
    }],
  }, {
    title: '游戏',
    childs: [{
      title: 'vr',
      path: 'tech/game/vr',
    }],
  }],
};

const navData: navConstructor[] = [{
  title: '实用工具',
}, {
  title: '技术储备',
}];

const Home: NextPage = (props) => {
  const [, setLoading] = useAtom(loading);
  const [menu, setMenu] = useState<menuConstructor[]>([]);
  const [current, setCurrent] = useState<number>(1);
  useEffect(() => {
    setMenu(menuData.menu1);
  }, []);
  console.log({ Router });
  const jump = async (num: number) => {
    setLoading(true);
    setMenu(menuData[`menu${num}`]);

    setLoading(false);
  };

  return <>
    <aside className={`flex-none ${styles['mod-aside']}`}>
      <div className={styles['aside-logo']}>YYDS-LIBS</div>
      <div className={styles['aside-menu']}>
        <tree-wc
          data={JSON.stringify(menu)}
          color="#b7b7b7"
        />
      </div>
    </aside>
    <div className={`flex-auto px-10 ${styles['mod-content']}`}>
      <header className={`py-2 ${styles.header}`}>
        {
          navData.map(
            (nav: navConstructor, i: number) => <Button
              key={nav.title}
              onClick={() => { jump(i); }}
              txt={nav.title}
              className={current === i ? '' : ''}
            />,
          )
        }
        <p className="clear-both"></p>
      </header>
      <div className={styles.bk}></div>
      {props.children}
    </div>
  </>;
};

export default Home;
