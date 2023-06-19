/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2018-08-21 11:50:31
 */

import { EasyFetch } from '@tencent/feone-common-lib';
// import { logout } from '@/model/user';
console.log({ EasyFetch });
const request = new EasyFetch('http://43.153.8.12:3335', {
  // credentials: true,
  headers: {
    Authorization: 'coln',
  },
});
export interface JsonError {
  id?: number
  links?: object
  status: number
  code: number
  title: string
  detail: string
  source?: object
  meta?: object
}
export interface IErrorJson extends Error {
  errors: JsonError
}

request.onRequest({
  yes(config: any) {
    return config;
  },
  no(err: any) {
    console.log({ err });
  },
});
request.onResponse({
  yes(res: any) {
    // 登录态失效
    if (res?.data?.code === 10010) {
      console.warning('登录已过期，3秒后跳转首页重新登录。', 3, () => {
        // logout().then(() => {
        //   window.location.href = '/';
        // });
      });
    }
  },
  no(errors: JsonError) {
    console.log('%c json api errors console: ', 'color:#ff4d4f;font-size:18px;');
    console.table();
    if (errors?.code === 504) {
      console.error(errors?.title);
    }
    if (errors?.code === 500) {
      console.error(errors?.title || '网络错误!');
    }
    // return errors;
  },
});
export default request;
