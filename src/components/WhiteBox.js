import React from 'react'
import { Box } from '@chakra-ui/core'
export function WhiteBox({ children, onClick, ...rest }) {
  return (
    <Box
      {...rest}
      onClick={onClick}
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
