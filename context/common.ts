/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-28 00:48:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-16 14:41:09
 */
import { atom, useAtom } from "jotai";
const account = atom('');
const loading = atom(false);

export {
  account,
  loading,
}