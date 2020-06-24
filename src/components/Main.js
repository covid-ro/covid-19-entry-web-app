import React from 'react'
import { Flex } from '@chakra-ui/core'

export function Main({ children }) {
  return (
    <Flex
      width="100%"
      minH="80vh"
      maxW="760px"
      mx="auto"
      my={[1, 4, 10, 10]}
      px={[2, 4, 10, 10]}>
      {children}
    </Flex>
  )
}
