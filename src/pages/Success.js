import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
  Flex,
  Heading,
  Button,
  Modal,
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Stack,
  IconButton,
  Link as Anchor,
} from '@chakra-ui/core'

import { QRCode } from 'react-qr-svg'
import jrQrcode from 'jr-qrcode'

import { LanguageContext } from '../locale/LanguageContext'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'
import Document from '../js/document'
import { countriesList } from '../assets/data/groupedCountries'
import { Facebook, Twitter, Mail, Printer } from 'react-feather'
const api = process.env.REACT_APP_API

function Success() {
  const toast = useToast()
  const [show, setShow] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const languageContext = useContext(LanguageContext)
  const declarationCodes = JSON.parse(localStorage.getItem('declaration_code'))
  async function download(code) {
    let doc = new Document()
    const { declaration } = await getDeclaratie(code)
    if (declaration) {
      const qrMessage = `${declaration.code}  ${declaration.cnp}`
      const qrcode = jrQrcode.getQrBase64(qrMessage)
      const documentDate = new Date(
        declaration.created_at
          .toString()
          .substring(0, declaration.created_at.length - 5)
      ).toLocaleDateString('ro-RO')
      const data = {
        locale: languageContext.language,
        code: declaration.code,
        measure: {
          hospital: true,
          quarantine: true,
          isolation: true,
        },
        lastName: declaration.surname,
        firstName: declaration.name,
        idCardNumber: declaration.cnp,
        dateOfBirth: {
          year: declaration.birth_date.split('-')[0],
          month: declaration.birth_date.split('-')[1],
          day: declaration.birth_date.split('-')[2],
        },
        countryDeparture: countriesList.find(
          (country) =>
            country.value === declaration.travelling_from_country_code
        ).label,
        destinationAddress: declaration.home_isolated
          ? declaration.home_address ||
            languageContext.dictionary['homeAddress']
          : `${declaration.isolation_addresses[0].street}, ${declaration.isolation_addresses[0].number},  ${declaration.isolation_addresses[0].bloc},  ${declaration.isolation_addresses[0].entry},  ${declaration.isolation_addresses[0].apartment},  ${declaration.isolation_addresses[0].city},  ${declaration.isolation_addresses[0].county}, `,
        phoneNumber: declaration.phone,
        documentDate: documentDate,
      }
      return doc.download(data, qrcode)
    }
  }
  const token = localStorage.getItem('token')
  async function getDeclaratie(code) {
    setDisabled(true)
    try {
      const request = await fetch(`${api}/declaration-web/${code}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': process.env.REACT_APP_API_KEY,
          'Content-Type': 'application/json',
        },
      })
      const response = await request.json()
      if (response.status === 'success') {
        setDisabled(false)
        return response
      } else {
        let message
        switch (response.message) {
          case 'Unauthorized':
            message = languageContext.dictionary['unauthorized']
            break
          default:
            message = languageContext.dictionary['unknownError']
        }
        setDisabled(false)
        toast({
          title: languageContext.dictionary['error'],
          descripaddingTopion: message,
          status: 'error',
          isClosable: true,
          duration: null,
        })
        return response
      }
    } catch (err) {
      setDisabled(false)
      toast({
        title: languageContext.dictionary['error'],
        descripaddingTopion: err.message,
        status: 'error',
        isClosable: true,
        duration: null,
      })
    }
  }
  const bgColorQR = useColorModeValue('white', '#171923')
  const fgColorQR = useColorModeValue('#171923', 'white')
  const overlayColor = useColorModeValue('rgba(255,255,255,1)', '#171923')
  return (
    <Layout title="Codurile dumneavoastră">
      {!declarationCodes ? (
        <Redirect
          to={{
            pathname: '/introducere-telefon',
            state: { message: languageContext.dictionary['noCodesYet'] },
          }}
        />
      ) : (
        <WhiteBox p={[2, 8, 8, 8]}>
          <Heading textAlign="center" marginBottom="12">
            <Trans id="yourCodesLabel" />
          </Heading>
          {declarationCodes?.map((declaration) => (
            <Flex
              marginTop="4"
              marginBottom="16"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              key={declaration.code}>
              <Heading size="md">
                {declaration.name} {declaration.surname}
              </Heading>
              <Button
                colorScheme="brand"
                variant="outline"
                size="lg"
                marginTop="8"
                width="256px"
                onClick={() => setShow(declaration.code)}
                cursor="zoom-in"
                fontWeight="bold"
                letterSpacing="4px">
                {declaration.code}
              </Button>
              <Button
                colorScheme="brand"
                size="lg"
                marginTop="4"
                marginBottom="8"
                width="256px"
                leftIcon={<Printer size={16} />}
                fontWeight="bold"
                disabled={disabled}
                isLoading={disabled}
                loadingText={<Trans id="downloading" />}
                onClick={() => download(declaration.code)}>
                <Trans id="download" />
              </Button>
              <QRCode
                bgColor={bgColorQR}
                fgColor={fgColorQR}
                level="Q"
                onClick={() => setShow(declaration.code)}
                style={{ width: 256, cursor: 'zoom-in' }}
                value={`${declaration.code}  ${declaration.cnp}`}
              />
              <Modal
                isOpen={show === declaration.code}
                onClose={() => setShow(null)}
                isCentered
                size="full">
                <ModalOverlay backgroundColor={overlayColor}>
                  <ModalContent>
                    <ModalHeader>
                      {declaration.name} {declaration.surname}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                      d="flex"
                      flexDirection="column"
                      alignItems="center">
                      <QRCode
                        bgColor={bgColorQR}
                        fgColor={fgColorQR}
                        level="Q"
                        style={{ width: 300 }}
                        value={`${declaration.code}  ${declaration.cnp}`}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="brand"
                        marginRight={3}
                        onClick={() => setShow(null)}>
                        <Trans id="close" />
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </ModalOverlay>
              </Modal>
            </Flex>
          ))}
          <Heading size="md" lineHeight="32px" fontWeight="bold">
            <Trans id="finishScreenFirstLine" />
          </Heading>
          <Heading
            size="md"
            lineHeight="32px"
            paddingTop="4"
            fontWeight="regular">
            <Trans id="printNotice" />
          </Heading>
          <Heading
            size="md"
            lineHeight="32px"
            paddingTop="4"
            fontWeight="regular">
            <Trans id="finishScreenSecondLine" />
          </Heading>
          <Heading
            size="md"
            lineHeight="32px"
            paddingTop="4"
            fontWeight="regular">
            <Trans id="finisScreenThirdLine" />
          </Heading>
          <Flex
            marginTop="4"
            marginBottom="16"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <Link to="/introducere-telefon">
              <Button colorScheme="brand" size="lg" marginTop="8" width="320px">
                <Trans id="adaugaMembru" />
              </Button>
            </Link>
            <Link to="/multumim">
              <Button colorScheme="brand" size="lg" marginTop="8" width="320px">
                <Trans id="nuMaiAdaug" />
              </Button>
            </Link>
            <Link to="/faq">
              <Button colorScheme="brand" size="lg" marginTop="8" width="320px">
                <Trans id="questionsAnswers" />
              </Button>
            </Link>
            <Stack direction="row" marginTop="12">
              <Anchor
                href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fchestionar.stsisp.ro"
                isExternal>
                <IconButton
                  colorScheme="facebook"
                  icon={<Facebook color="white" strokeWidth={1} />}
                  aria-label="Facebook share"
                />
              </Anchor>
              <Anchor
                href="https://twitter.com/intent/tweet/?text=Covid-SAFE@Frontieră&amp;url=https%3A%2F%2Fchestionar.stsisp.ro"
                isExternal>
                <IconButton
                  colorScheme="twitter"
                  icon={<Twitter color="white" strokeWidth={1} />}
                  aria-label="Twitter share"
                />
              </Anchor>
              <Anchor
                href="mailto:?subject=Covid-SAFE@Frontieră&body=https%3A%2F%2Fchestionar.stsisp.ro"
                isExternal>
                <IconButton
                  colorScheme="teal"
                  icon={<Mail color="white" strokeWidth={1} />}
                  aria-label="Email share"
                />
              </Anchor>
            </Stack>
          </Flex>
        </WhiteBox>
      )}
    </Layout>
  )
}
export default Success
