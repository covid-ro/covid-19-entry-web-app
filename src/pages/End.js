import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'

export function End() {
  return (
    <WhiteBox>
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
      </Box>
    </WhiteBox>
  )
}
