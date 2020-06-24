import React from 'react'
import { Box, useColorMode } from '@chakra-ui/core'
export function WhiteBox({ children, onClick, ...rest }) {
  const [colorMode] = useColorMode()
  const borderColor = { light: 'gray.200', dark: 'gray.700' }
  const bgColor = { light: 'white', dark: 'gray.900' }
  return (
    <Box
      {...rest}
      onClick={onClick}
      borderColor={borderColor[colorMode]}
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor[colorMode]}
      my="4"
      w="100%">
      {children}
    </Box>
  )
}
