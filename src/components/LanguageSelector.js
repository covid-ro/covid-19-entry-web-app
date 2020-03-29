import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Flex, Box, Text } from '@chakra-ui/core'
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
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box w="100%" justifyContent="center" mt="8" mb="16" d="flex">
        <Text
          fontWeight="semibold"
          color={languageContext.language === 'ro' ? 'brand.800' : 'gray.700'}
          onClick={() => languageContext.setLanguage('ro')}>
          RO
        </Text>{' '}
        |{' '}
        <Text
          fontWeight="semibold"
          color={languageContext.language === 'en' ? 'brand.800' : 'gray.700'}
          onClick={() => languageContext.setLanguage('en')}>
          EN
        </Text>
      </Box>
      <Trans id="langSelect" />
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        justifyContent="center">
        <Button
          variantColor="brand"
          size="lg"
          mt="8"
          w="320px"
          onClick={e => forwardAction(e, 'ro')}>
          <Trans id="ro" />
        </Button>
        <Button
          variantColor="brand"
          size="lg"
          mt="8"
          w="320px"
          onClick={e => forwardAction(e, 'en')}>
          <Trans id="en" />
        </Button>
      </Box>
    </Flex>
  )
}
