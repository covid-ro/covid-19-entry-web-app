import React from 'react'
import { Heading } from '@chakra-ui/core'
import { LanguageSelector } from '../components/LanguageSelector'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'

export function Home() {
  return (
    <Layout title="Acasă">
      <WhiteBox p={[1, 8]}>
        <Heading size="md" lineHeight="32px" fontWeight="400">
          <Trans id="infoLabelBegin" />
        </Heading>
        <LanguageSelector />
      </WhiteBox>
    </Layout>
  )
}
