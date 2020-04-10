import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
export function Success() {
  return (
    <WhiteBox>
      <Heading size="md" lineHeight="32px" fontWeight="regular">
        <Trans id="start" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <strong>
          <Trans id="infoLabelBold" />
        </strong>
        <Trans id="infoLabelEnd" />
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
            <Trans id="completeDeclaration" />
          </Button>
        </Link>
      </Box>
    </WhiteBox>
  )
}
