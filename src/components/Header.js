import React from 'react'
import { Heading, Flex, Image, Box, Text } from '@chakra-ui/core'
import { Menu } from 'react-feather'
import logo from '../assets/images/gov-ro.svg'
import { Trans } from '../locale/Trans'
const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
)
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
      px={[2, 4, 10]}
      py="4"
      bg="white"
      color="brand.800"
      {...props}>
      <Flex align="center" flexGrow={1}>
        <Image src={logo} alt="Guvernul Romaniei" />
        <Heading
          as="h1"
          size={['xs', 'lg']}
          color="brand.900"
          pl="1"
          fontWeight="normal"
          maxW="200px">
          <Trans id="title" />
        </Heading>
      </Flex>
      <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
        <Menu size={30} strokeWidth={3} />
      </Box>
      <Box
        display={{ sm: show ? 'block' : 'none', md: 'flex' }}
        width={{ sm: 'full', md: 'auto' }}
        alignItems="center">
        <MenuItems>Despre proiect</MenuItems>
        <MenuItems>Parteneri</MenuItems>
        <MenuItems>Alte informatii</MenuItems>
      </Box>
    </Flex>
  )
}
