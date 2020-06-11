import React from 'react'
import { Box, Link, Flex, Image, Stack } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import cn from '../assets/images/cn.svg'
import sts from '../assets/images/logo.png'
export function Footer() {
  return (
    <Flex width="100%" maxW="760px" mx="auto" px={[2, 4, 10]}>
      <Box
        borderColor="gray.200"
        borderBottomColor="white"
        borderWidth="1px"
        p="6"
        roundedTop="md"
        textAlign="center"
        bg="white"
        w="100%">
        <Trans id="footer" />{' '}
        <Link isExternal href="https://citizennext.ro" color="brand.500">
          Citizen Next
        </Link>{' '}
        <Trans id="and" />{' '}
        <Link isExternal href="https://sts.ro" color="brand.500">
          <Trans id="sts" />
        </Link>
        <Stack isInline alignItems="center" justifyContent="center" mt="2">
          <Link isExternal href="https://citizennext.ro">
            <Image
              size="40px"
              objectFit="cover"
              src={cn}
              alt="Citizen Next"
              mx="4"
            />
          </Link>
          <Link isExternal href="https://sts.ro">
            <Image
              size="30px"
              objectFit="center"
              src={sts}
              alt={<Trans id="sts" />}
              mx="4"
            />
          </Link>
        </Stack>
      </Box>
    </Flex>
  )
}
