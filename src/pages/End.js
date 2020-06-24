import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, useToast, Link as Anchor } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { LanguageContext } from '../locale/LanguageContext'
import { Layout } from '../components/Layout'

function End() {
  const toast = useToast()
  const languageContext = useContext(LanguageContext)
  function deleteStatements() {
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
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
    <Layout title="La revedere">
      <WhiteBox p={[2, 8, 8, 8]}>
        <Heading size="lg" lineHeight="32px" fontWeight="bold">
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
          <Anchor as={Link} to="/faq">
            <Button colorScheme="brand" size="lg" mt="8" w="320px">
              <Trans id="questionsAnswers" />
            </Button>
          </Anchor>
          <Anchor
            href={`https://reopen.europa.eu/${languageContext.language}/map/ROU`}
            isExternal>
            <Button colorScheme="brand" size="lg" mt="8" w="320px">
              <Trans id="sfaturiDeCalatorie" />
            </Button>
          </Anchor>

          <Button
            colorScheme="brand"
            size="lg"
            mt="8"
            w="320px"
            onClick={() => deleteStatements()}>
            <Trans id="deleteStatements" />
          </Button>
        </Box>
      </WhiteBox>
    </Layout>
  )
}
export default End
