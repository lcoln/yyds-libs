import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { installWC } from '@yyds-lib/airui';
import { useRouter } from 'next/router';
import 'css-doodle';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';

// const { installWC } = dynamic(
//   () => {
//     return import("@linteng/airui");
//   },
//   { ssr: false }
// );
function MyApp({ Component, pageProps }: AppProps) {
  const history = useRouter();
  console.log({ history });
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
