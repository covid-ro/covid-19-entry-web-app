import React, { useContext } from 'react'
import {
  Heading,
  Flex,
  Image,
  Box,
  Text,
  Link as Anchor,
} from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import { Menu } from 'react-feather'
import logo from '../assets/images/logo.png'
import { Trans } from '../locale/Trans'
import { LanguageContext } from '../locale/LanguageContext'
const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} fontWeight="semibold" display="block">
    {children}
  </Text>
)
export function Header(props) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  const languageContext = useContext(LanguageContext)

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
          <Anchor
            href="https://citizennext.ro/proiecte/covid-safe-frontiera"
            isExternal
            style={{ textDecoration: 'none' }}>
            <Trans id="about" />
          </Anchor>
        </MenuItems>
        <MenuItems>
          <Link to="/succes">
            <Trans id="codes" />
          </Link>
        </MenuItems>
        <MenuItems>
          <Anchor
            href={`https://reopen.europa.eu/${languageContext.language}/map/ROU`}
            isExternal>
            <Trans id="otherInfo" />
          </Anchor>
        </MenuItems>
      </Box>
    </Flex>
  )
}
