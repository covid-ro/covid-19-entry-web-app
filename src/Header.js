import React from 'react'
import { Heading, Flex } from '@chakra-ui/core'

const Header = props => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="brand.800"
      color="white"
      {...props}>
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          COVID
        </Heading>
      </Flex>
    </Flex>
  )
}

export default Header
