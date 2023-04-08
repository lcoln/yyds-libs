/* eslint-disable import/no-relative-packages */
/* eslint-disable import/extensions */
// eslint-disable-next-line import/extensions, import/no-relative-packages
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'css-doodle';
import Layout from '@/components/layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@/styles/generator.css';
import '@/styles/message.css';

const routeConfig: {
  [key: string]: {
    title: string,
    bg: string
  }
} = {
  '/': {
    title: 'Home',
    bg: '/img/ai/1.png',
  },
  '/tools': {
    title: 'Tools',
    bg: '/img/ai/2.png',
  },
};
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const config = routeConfig[router.pathname];
  console.log({ config });
  useEffect(() => {
    const importWC = async () => {
      await import('../.yalc/@bd/ui/dist/tab/index.js');
      await import('../.yalc/@bd/ui/dist/form/input.js');
      await import('../.yalc/@bd/ui/dist/form/button.js');
    };
    importWC();
  }, []);
  return <Layout bg={config?.bg}>
    <Component {...pageProps} />
  </Layout>;
}

export default MyApp;
