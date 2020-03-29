import React from 'react'
import { Box } from '@chakra-ui/core'
export function WhiteBox({ children }) {
  return (
    <Box
      borderColor="gray.200"
      borderWidth="1px"
      rounded="md"
      bg="white"
      p={[1, 8]}
      my="4"
      w="100%">
      {children}
    </Box>
  )
}
