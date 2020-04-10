import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, Text } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
export function Success() {
  const declarationCodes = JSON.parse(localStorage.getItem('declaration_code'))
  return (
    <WhiteBox>
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Text>
          <Trans id="yourCodesLabel" />
        </Text>
        {declarationCodes.map((code) => (
          <Button
            variantColor="brand"
            variant="outline"
            size="lg"
            my="8"
            w="220px"
            key={code}
            fontWeight="bold">
            {code}
          </Button>
        ))}
      </Box>
      <Heading size="md" lineHeight="32px" fontWeight="bold">
        <Trans id="finishScreenFirstLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="finishScreenSecondLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="finisScreenThirdLine" />
      </Heading>
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Link to="/introducere-telefon">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="adaugaMembru" />
          </Button>
        </Link>
        <Link to="/multumim">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="nuMaiAdaug" />
          </Button>
        </Link>
      </Box>
    </WhiteBox>
  )
}
