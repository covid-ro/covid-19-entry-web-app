import React from 'react'
import { Heading, Flex, Image, Box, Text } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import { Menu } from 'react-feather'
import logo from '../assets/images/gov-ro.png'
import { Trans } from '../locale/Trans'
const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} fontWeight="semibold" display="block">
    {children}
  </Text>
)
export function Header(props) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  return (
    <Flex
      as="nav"
      pos="sticky"
      top="0"
      zIndex="sticky"
      align="center"
      justify="space-between"
      borderBottom="1px"
      borderColor="gray.300"
      wrap="wrap"
      px={[2, 4, 10]}
      py="4"
      bg="white"
      color="brand.900"
      {...props}>
      <Link to="/">
        <Flex align="center" flexGrow={1}>
          <Image src={logo} alt="Guvernul Romaniei" height="50px" />
          <Heading
            as="h1"
            size={['xs', 'lg']}
            color="brand.900"
            ml="4"
            fontWeight="normal"
            maxW="200px">
            <Trans id="title" />
          </Heading>
        </Flex>
      </Link>
      <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
        <Menu size={30} strokeWidth={3} />
      </Box>
      <Box
        display={{ xs: show ? 'block' : 'none', md: 'flex' }}
        width={{ xs: 'full', md: 'auto' }}
        alignItems="center">
        <MenuItems>
          <Link>
            <Trans id="about" />
          </Link>
        </MenuItems>
        <MenuItems>
          <Link>
            <Trans id="partners" />
          </Link>
        </MenuItems>
        <MenuItems>
          <Link>
            <Trans id="otherInfo" />
          </Link>
        </MenuItems>
      </Box>
    </Flex>
  )
}
