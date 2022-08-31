/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-28 00:48:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-29 20:49:44
 */
import { atom } from 'jotai';

const account = atom('');
const loading = atom(false);

export {
  account,
  loading,
};
