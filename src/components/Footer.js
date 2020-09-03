import React from 'react'
import {
  Box,
  Link,
  Flex,
  Image,
  Stack,
  useColorModeValue,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import cn from '../assets/images/cn.svg'
import sts from '../assets/images/logo.png'
export function Footer() {
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const color = useColorModeValue('brand.900', 'brand.100')
  return (
    <Flex width="100%" maxW="760px" mx="auto" px={[2, 4, 10]}>
      <Box
        borderColor={borderColor}
        borderWidth="1px 1px 0 1px"
        p="6"
        borderTopRadius="md"
        textAlign="center"
        bg={bgColor}
        color={color}
        w="100%">
        <Trans id="footer" />{' '}
        <Link isExternal href="https://citizennext.ro" color="brand.500">
          Citizen Next
        </Link>{' '}
        <Trans id="and" />{' '}
        <Link isExternal href="https://sts.ro" color="brand.500">
          <Trans id="sts" />
        </Link>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          mt="2">
          <Link isExternal href="https://citizennext.ro">
            <Image
              width="40px"
              height="40px"
              objectFit="cover"
              src={cn}
              alt="Citizen Next"
              mx="4"
            />
          </Link>
          <Link isExternal href="https://sts.ro">
            <Image
              width="30px"
              height="30px"
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
