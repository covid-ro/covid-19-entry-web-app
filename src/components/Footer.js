import React from 'react'
import { Box, Link, Flex, Image, Stack, useColorMode } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import cn from '../assets/images/cn.svg'
import sts from '../assets/images/logo.png'
export function Footer() {
  const { colorMode } = useColorMode()
  const bgColor = { light: 'white', dark: 'gray.900' }
  const borderColor = { light: 'gray.200', dark: 'gray.700' }
  const color = { light: 'brand.900', dark: 'brand.100' }
  return (
    <Flex width="100%" maxW="760px" mx="auto" px={[2, 4, 10]}>
      <Box
        borderColor={borderColor[colorMode]}
        borderWidth="1px 1px 0 1px"
        p="6"
        roundedTop="md"
        textAlign="center"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
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
