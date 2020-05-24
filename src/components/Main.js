import React from 'react'
import { Flex } from '@chakra-ui/core'

export function Main({ children }) {
  return (
    <Flex
      width="100%"
      minH="70vh"
      maxW="760px"
      mx="auto"
      my={[1, 4, 10]}
      px={[2, 4, 10]}>
      {children}
    </Flex>
  )
}
