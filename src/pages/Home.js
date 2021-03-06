import React from 'react'
import { Heading } from '@chakra-ui/core'
import { LanguageSelector } from '../components/LanguageSelector'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'

function Home() {
  return (
    <Layout title="Acasă">
      <WhiteBox p={[2, 8, 8, 8]}>
        <Heading size="md" as="h1" lineHeight="32px" fontWeight="normal">
          <Trans id="infoLabelBegin" />
        </Heading>
        <LanguageSelector />
      </WhiteBox>
    </Layout>
  )
}
export default Home
