import React from 'react'
import { Box, Link, Flex } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
export function Footer() {
  return (
    <Flex width="100%" maxW="760px" mx="auto" mt={[1, 4, 10]} px={[2, 4, 10]}>
      <Box
        borderColor="gray.200"
        borderBottomColor="white"
        borderWidth="1px"
        p="6"
        roundedTop="md"
        textAlign="center"
        bg="white"
        mt="4"
        w="100%">
        <Trans id="footer" />{' '}
        <Link isExternal href="https://citizennext.ro" color="brand.500">
          Citizen Next
        </Link>{' '}
        <Trans id="and" />{' '}
        <Link isExternal href="https://sts.ro" color="brand.500">
          <Trans id="sts" />
        </Link>
      </Box>
    </Flex>
  )
}
