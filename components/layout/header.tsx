import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Header: NextPage = () => {
  const router = useRouter();

  const routes = [{
    name: 'Home',
    pathname: '/',
  }, {
    name: 'Tools',
    pathname: '/tools',
  }, {
    name: 'Article',
    pathname: '/article',
  }, {
    name: 'Music',
    pathname: '/mrticle',
  }];
  // eslint-disable-next-line max-len
  return <header className="fixed top-0 left-0 flex justify-between w-full py-4 px-20 font-extralight z-50 tracking-widest transition text-[#d9d9d9]">
    <div className="text-2xl text-white">Imagine.io</div>
    <div className="flex space-x-10">
      {
        routes.map((v, i) => <a
          key={i}
          href={v.pathname}
          className={
            router.pathname === v.pathname
              ? 'text-white hover:text-white'
              : 'hover:text-white'
          }
        >
          {v.name}
        </a>)
      }
    </div>
  </header>;
};

export default Header;
