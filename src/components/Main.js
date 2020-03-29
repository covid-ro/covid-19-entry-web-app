import React from 'react'
import { Flex } from '@chakra-ui/core'

export function Main({ children }) {
  return (
    <Flex width="100%" maxW="760px" mx="auto" my={10} px={[2, 4, 10]}>
      {children}
    </Flex>
  )
}
