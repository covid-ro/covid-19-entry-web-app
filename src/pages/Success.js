import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/core'

import { QRCode } from 'react-qr-svg'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
export function Success() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const declarationCodes = JSON.parse(localStorage.getItem('declaration_code'))
  localStorage.removeItem('token')
  return (
    <WhiteBox p={[1, 8]}>
      <Text textAlign="center">
        <Trans id="yourCodesLabel" />
      </Text>
      {declarationCodes.map((declaration) => (
        <Flex
          mt="4"
          mb="16"
          d="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          onClick={onOpen}
          style={{ cursor: 'pointer' }}>
          <Heading size="lg">
            {declaration.name} {declaration.surname}
          </Heading>
          <Button
            variantColor="brand"
            variant="outline"
            size="lg"
            my="8"
            w="220px"
            key={declaration.code}
            fontWeight="bold">
            {declaration.code}
          </Button>
          <QRCode
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{ width: 256 }}
            value={declaration.code}
          />
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
            <ModalOverlay backgroundColor={'rgba(255,255,255,1)'} />
            <ModalContent>
              <ModalHeader>
                {declaration.name} {declaration.surname}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody d="flex" flexDirection="column" alignItems="center">
                <QRCode
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                  style={{ width: 300 }}
                  value={declaration.code}
                />
              </ModalBody>

              <ModalFooter>
                <Button variantColor="brand" mr={3} onClick={onClose}>
                  Închide
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      ))}
      <Heading size="md" lineHeight="32px" fontWeight="bold">
        <Trans id="finishScreenFirstLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="finishScreenSecondLine" />
      </Heading>
      <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
        <Trans id="finisScreenThirdLine" />
      </Heading>
      <Box
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Link to="/introducere-telefon">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="adaugaMembru" />
          </Button>
        </Link>
        <Link to="/multumim">
          <Button variantColor="brand" size="lg" mt="8" w="320px">
            <Trans id="nuMaiAdaug" />
          </Button>
        </Link>
      </Box>
    </WhiteBox>
  )
}
