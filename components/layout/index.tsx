import type { NextPage } from 'next';
import Image from 'next/image';
import Header from './header';

const Layout: NextPage<{bg: string}> = ({ bg, children }) => <>
  <Header />
  <div className="w-full h-full font-light text-slate-200">
    <div className="fixed w-full h-full z-[-1]">
      <Image
        className="w-full h-full object-cover"
        src={bg}
        alt=""
        layout="fill"
      />
    </div>
    <div className="fixed left-0 top-0 right-0 bottom-0 w-full h-full bg-black opacity-50 z-[-1]"></div>
    {children}
  </div>
</>;

export default Layout;
