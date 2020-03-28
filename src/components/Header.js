import React from 'react'
import { Heading, Flex, Image, Box, Button } from '@chakra-ui/core'
import logo from '../assets/images/gov-ro.svg'
import { Trans } from '../locale/Trans'
export function Header(props) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      borderBottom="1px"
      borderColor="gray.300"
      wrap="wrap"
      padding="1.5rem 10rem"
      bg="white"
      color="brand.800"
      {...props}>
      <Flex align="center" mr={5}>
        <Image src={logo} alt="Guvernul Romaniei" />
        <Heading
          as="h1"
          size="lg"
          color="brand.900"
          pl="5"
          fontWeight="normal"
          maxW="300px">
          <Trans id="title" />
        </Heading>
      </Flex>
      <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ sm: show ? 'block' : 'none', md: 'block' }}
        mt={{ base: 4, md: 0 }}>
        <Button bg="transparent" border="1px">
          <Trans id="about" />
        </Button>
      </Box>
    </Flex>
  )
}
