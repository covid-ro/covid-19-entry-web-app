import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Flex, Box, Link, useColorMode } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { LanguageContext } from '../locale/LanguageContext'
import { Button } from '@chakra-ui/core'
export function LanguageSelector() {
  let history = useHistory()
  const languageContext = useContext(LanguageContext)
  function forwardAction(e, lang) {
    languageContext.setLanguage(lang)
    e.stopPropagation()
    history.push('/start')
  }
  const { colorMode } = useColorMode()
  const color = { light: '#2653B0', dark: '#fff' }
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box w="100%" justifyContent="center" mt="8" mb="6" d="flex">
        <Link
          fontWeight="semibold"
          color={
            languageContext.language === 'ro' ? color[colorMode] : 'gray.700'
          }
          onClick={() => languageContext.setLanguage('ro')}>
          RO
        </Link>{' '}
        |{' '}
        <Link
          fontWeight="semibold"
          color={
            languageContext.language === 'en' ? color[colorMode] : 'gray.700'
          }
          onClick={() => languageContext.setLanguage('en')}>
          EN
        </Link>
      </Box>
      <Trans id="langSelect" />
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Button
          variantColor="brand"
          size="lg"
          mt="8"
          w="300px"
          onClick={(e) => forwardAction(e, 'ro')}>
          <Trans id="ro" />
        </Button>
        <Button
          variantColor="brand"
          size="lg"
          mt="8"
          w="300px"
          onClick={(e) => forwardAction(e, 'en')}>
          <Trans id="en" />
        </Button>
      </Box>
    </Flex>
  )
}
