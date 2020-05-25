import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, useToast } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { LanguageContext } from '../locale/LanguageContext'

export function End() {
  const toast = useToast()
  const languageContext = useContext(LanguageContext)

  function deleteStatements() {
    localStorage.removeItem('declaration_code')
    toast({
      title: languageContext.dictionary['success'],
      description: languageContext.dictionary['statementsDeleted'],
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }
  return (
    <WhiteBox p={[1, 8]}>
      <Heading size="md" lineHeight="32px" fontWeight="bold">
        <Trans id="endScreenFirstLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="endScreenSecondLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="endScreenThirdLine" />
      </Heading>
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Link to="/sfaturi">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="sfaturiDeCalatorie" />
          </Button>
        </Link>
        <Button
          variantColor="brand"
          size="lg"
          mt="8"
          w="320px"
          onClick={() => deleteStatements()}>
          <Trans id="deleteStatements" />
        </Button>
      </Box>
    </WhiteBox>
  )
}
