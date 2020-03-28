import React from 'react'
import { Box, Heading } from '@chakra-ui/core'
import { LanguageSelector } from '../components/LanguageSelector'
import { Trans } from '../locale/Trans'
export function Home() {
  return (
    <Box
      borderColor="gray.200"
      borderWidth="1px"
      rounded="md"
      bg="white"
      p="8"
      w="100%">
      <Box maxW="lg" mx="auto">
        <Heading size="md" lineHeight="32px" fontWeight="400">
          <Trans id="intro" />
        </Heading>
        <LanguageSelector />
      </Box>
    </Box>
  )
}
