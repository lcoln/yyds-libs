import type { NextPage } from 'next'
import Layout from "@/components/layout";
import Loading from "@/components/loading";
import { Suspense } from 'react'
import 'css-doodle'

const Index: NextPage = (props) => {

  return <Suspense fallback={Loading}><Layout>
    <div>index</div>
  </Layout></Suspense>
}

export default Index
