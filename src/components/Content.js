import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/core'

export function Content({ children }) {
  const bgColor = useColorModeValue('gray.100', 'gray.800')
  const color = useColorModeValue('gray.700', 'gray.200')
  return (
    <Box color={color} minHeight="100vh" backgroundColor={bgColor} width="100%">
      {children}
    </Box>
  )
}
