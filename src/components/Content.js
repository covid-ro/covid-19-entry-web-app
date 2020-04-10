import React from 'react'
import { Box } from '@chakra-ui/core'

export function Content({ children }) {
  return (
    <Box color="gray.700" minHeight="100vh" bg="gray.100" width="100%">
      {children}
    </Box>
  )
}
