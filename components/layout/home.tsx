/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-25 13:09:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-16 15:52:10
 */
import { useState, ChangeEvent } from 'react'
import type { NextPage } from 'next'
import styles from './index.module.css'
import { account, loading } from '@/context/common';
import { useAtom } from "jotai";


const menu = [{
  title: 'Overview',
  path: 'overview',
}]


const Home: NextPage = (props) => {
  const [, setLoading] = useAtom(loading);
  const [readValue, setReadValue] = useState('')

  const connect = async () => {
    setLoading(true);
    
    setLoading(false);
  }

  const Btns = () => {
    // const [txt, onChange] = useState<InputHTMLAttributes<HTMLInputElement>>('');
    const [count, setResult] = useState('')
    const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
      setResult(ev.target.value)
    }
    const write = async () => {
      setLoading(true);
      
      setLoading(false);
    }
    const read = async () => {
      setLoading(true);
      
      setLoading(false);
    }
    return <>
      <div className="m-5 w-full max-w-xs">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              write
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="write" onChange={onChange} />
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={write}>
              write
            </button>
          </div>
        </div>
      </div>
      <div className="m-5 w-full max-w-xs">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={read}>
              read
            </button>
            <input className="ml-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={readValue} readOnly />
          </div>
        </div>
      </div>
    </>
  }

  return <>
    <aside className={`flex-none ${styles["mod-aside"]}`}>
      <tree-wc data={JSON.stringify(menu)} color="#b7b7b7" />
    </aside>
    <div className={`flex-auto px-10`}>
      <header className={`py-2 ${styles.header}`}>
        <button className="float-right hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 rounded" onClick={connect}>
          connect
        </button>
        
        <p className="clear-both"></p>
      </header>
      {props.children}
    </div>
  </>
}

export default Home
