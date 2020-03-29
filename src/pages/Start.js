import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
export function Start() {
  return (
    <WhiteBox>
      <Heading size="md" lineHeight="32px" fontWeight="400">
        <Trans id="start" />
      </Heading>
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Link to="/form">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="completeDeclaration" />
          </Button>
        </Link>
      </Box>
    </WhiteBox>
  )
}
