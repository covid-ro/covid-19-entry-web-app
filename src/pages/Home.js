import React from 'react'
import { Heading } from '@chakra-ui/core'
import { LanguageSelector } from '../components/LanguageSelector'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'

export function Home() {
  return (
    <WhiteBox>
      <Heading size="md" lineHeight="32px" fontWeight="400">
        <Trans id="intro" />
      </Heading>
      <LanguageSelector />
    </WhiteBox>
  )
}
