import React from 'react'
import { Flex } from '@chakra-ui/core'

export function Content({ children }) {
  return (
    <Flex direction="column" color="gray.700" minHeight="100vh" bg="gray.100">
      {children}
    </Flex>
  )
}
