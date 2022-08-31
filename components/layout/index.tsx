import type { NextPage } from 'next';
import { loading } from '@/context/common';
import { useAtom } from 'jotai';
import styles from './index.module.css';
import Home from './home';

const Layout: NextPage = (props) => {
  const [_loading, _] = useAtom(loading);
  return (
    <div className={styles.container}>
      <main className={`flex ${styles.main}`}>
        <Home {...props} />
      </main>

      {
        _loading && <div className={styles['loader-box']}>
          <div className={styles.loader}></div>
        </div>
      }

    </div>
  );
};

export default Layout;
