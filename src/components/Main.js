import React from 'react'
import { Flex } from '@chakra-ui/core'

export function Main({ children }) {
  return (
    <Flex w="760px" mx="auto" my={10}>
      {children}
    </Flex>
  )
}
