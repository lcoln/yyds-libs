import type { NextPage } from 'next';
import Me from '@/assets/img/me.jpeg';
import 'css-doodle';
import Image from 'next/image';

// eslint-disable-next-line max-len
const Index: NextPage = () => <div className="flex absolute left-0 top-0 right-0 bottom-0 w-[800px] h-[300px] m-auto justify-center">
  <div className="relative flex rounded-full">
    <Image
      src={Me}
      alt=""
      className="rounded-full shadow-[0_0_5px_0_#999]"
      width="300"
      height="300"
    />
  </div>
  <div className="flex flex-col ml-6 justify-center">
    <span className="text-4xl">林腾</span>
    <span className="mt-2 text-2xl">一个兴趣使然的web工程师</span>
    <span className="mt-6 text-base">探索的道路，永无止境</span>
  </div>
</div>;

export default Index;
