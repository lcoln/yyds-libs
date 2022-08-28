// /*
//  * @Description: 
//  * @Version: 0.0.1
//  * @Autor: linteng
//  * @Date: 2022-04-28 00:45:39
//  * @LastEditors: Please set LastEditors
//  * @LastEditTime: 2022-04-28 00:47:09
//  */
// import { useState } from 'react';

// import { createContainer } from 'unstated-next';

// function useOverview() {
//   const [balance, setBalance] = useState(0);

//   return {
//     balance,
//     setBalance
//   };
// }

// const Overview = createContainer(useOverview);

// export default Overview;

import { atom, useAtom } from "jotai";

// 定义一个Atom，并给定默认值0
const balance = atom(0);
// const [, setValue] = useAtom(balance);
export default balance
