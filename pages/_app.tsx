import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { installWC } from '@linteng/airui';
import { useRouter } from 'next/router'
import 'css-doodle';
import dynamic from "next/dynamic";

// const { installWC } = dynamic(
//   () => {
//     return import("@linteng/airui");
//   },
//   { ssr: false }
// );
function MyApp({ Component, pageProps }: AppProps) {
  const history = useRouter()
  console.log({history})
  installWC([{
    name: 'tree-wc',
    config: {
      mode: 'browser',   // hash
      history
    }
  }, 'tab-wc'])
  return <Component {...pageProps} />
}

export default MyApp
