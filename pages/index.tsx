import type { NextPage } from 'next';
import Loading from '@/components/loading';
import { Suspense } from 'react';
import 'css-doodle';

const Index: NextPage = (props) => <Suspense fallback={Loading}>
    {props.children}
  </Suspense>;

export default Index;
