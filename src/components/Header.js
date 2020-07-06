import React, { useContext } from 'react'
import {
  Heading,
  Flex,
  Image,
  Box,
  Text,
  IconButton,
  useColorMode,
  Link as Anchor,
} from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import { Menu, Moon, Sun } from 'react-feather'
import logo from '../assets/images/logo.png'
import { Trans } from '../locale/Trans'
import { LanguageContext } from '../locale/LanguageContext'
const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, lg: 0 }} mr={6} fontWeight="semibold" display="block">
    {children}
  </Text>
)
export function Header(props) {
  const [show, setShow] = React.useState(false)
  const handleToggle = () => setShow(!show)
  const { colorMode, toggleColorMode } = useColorMode()
  const languageContext = useContext(LanguageContext)
  const bgColor = { light: 'white', dark: 'gray.900' }
  const color = { light: 'brand.900', dark: 'brand.100' }
  const borderColor = { light: 'gray.300', dark: 'gray.700' }
  return (
    <Flex
      as="nav"
      pos="sticky"
      top="0"
      zIndex="sticky"
      align="center"
      justify="space-between"
      borderBottom="1px"
      borderColor={borderColor[colorMode]}
      wrap="wrap"
      px={[2, 4, 10]}
      py="4"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}>
      <Link to="/">
        <Flex align="center" flexGrow={1}>
          <Image src={logo} alt="Guvernul Romaniei" height="50px" />
          <Heading
            as="h1"
            size={['xs', 'lg']}
            color={color[colorMode]}
            ml="4"
            fontWeight="normal"
            maxW="200px">
            <Trans id="title" />
          </Heading>
        </Flex>
      </Link>
      <Box display={{ md: 'block', lg: 'none' }} onClick={handleToggle}>
        <Menu size={30} strokeWidth={3} />
      </Box>
      <Box
        display={{
          xs: show ? 'block' : 'none',
          sm: show ? 'block' : 'none',
          lg: 'flex',
        }}
        alignItems="center"
        width={{ xs: 'full', md: 'full', lg: 'auto' }}>
        <MenuItems>
          <Link to="/succes">
            <Trans id="codes" />
          </Link>
        </MenuItems>
        <MenuItems>
          <Link to="/faq">
            <Trans id="questionsAnswers" />
          </Link>
        </MenuItems>
        <MenuItems>
          <Anchor
            href="https://citizennext.ro/proiecte/covid-safe-frontiera"
            isExternal
            style={{ textDecoration: 'none' }}>
            <Trans id="about" />
          </Anchor>
        </MenuItems>
        <MenuItems>
          <Anchor
            href={`https://reopen.europa.eu/${languageContext.language}/map/ROU`}
            isExternal>
            <Trans id="otherInfo" />
          </Anchor>
        </MenuItems>
        <IconButton
          float={{
            xs: show ? 'right' : 'none',
            sm: show ? 'right' : 'none',
          }}
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <Moon /> : <Sun />}
        />
      </Box>
    </Flex>
  )
}
