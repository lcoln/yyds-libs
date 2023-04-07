import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { installWC } from '@yyds-lib/airui';
import { useRouter } from 'next/router';
import 'css-doodle';
import Layout from '@/components/layout';
// import '@bd/ui/dist/tab';
// import { useEffect } from 'react';

// const { installWC } = dynamic(
//   () => {
//     return import("@linteng/airui");
//   },
//   { ssr: false }
// );
function MyApp({ Component, pageProps }: AppProps) {
  const history = useRouter();
  // console.log(9999);
  // useEffect(() => {
  //   const importWC = async () => {
  //     // eslint-disable-next-line import/extensions, import/no-relative-packages
  //     await import('../.yalc/@bd/ui/dist/tab/index.js');
  //   };
  //   importWC();
  // }, []);
  installWC([{
    name: 'tree-wc',
    config: {
      mode: 'browser', // hash
      history,
    },
  }, 'tab-wc']);
  return <Layout><Component {...pageProps} /></Layout>;
}

export default MyApp;
