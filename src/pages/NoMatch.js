import React from 'react'
import { Layout } from '../components/Layout'
import { Heading } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
export default () => (
  <Layout title="404">
    <WhiteBox p={[2, 8, 8, 8]}>
      <Heading size="lg" lineHeight="32px" fontWeight="400">
        <Trans id="noMatch" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="noMatchText" />
      </Heading>
    </WhiteBox>
  </Layout>
)
