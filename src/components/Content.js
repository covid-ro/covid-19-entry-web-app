import React from 'react'
import { Box, useColorMode } from '@chakra-ui/core'

export function Content({ children }) {
  const { colorMode } = useColorMode()
  const bgColor = { light: 'gray.100', dark: 'gray.800' }
  const color = { light: 'gray.700', dark: 'gray.200' }
  return (
    <Box
      color={color[colorMode]}
      minHeight="100vh"
      bg={bgColor[colorMode]}
      width="100%">
      {children}
    </Box>
  )
}
