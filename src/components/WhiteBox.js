import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/core'
export function WhiteBox({ children, onClick, ...rest }) {
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      {...rest}
      onClick={onClick}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor}
      my="4"
      w="100%">
      {children}
    </Box>
  )
}
