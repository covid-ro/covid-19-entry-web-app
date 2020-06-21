import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import {
  Box,
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
  useColorMode,
  Stack,
} from '@chakra-ui/core'
import { QRCode } from 'react-qr-svg'
import jrQrcode from 'jr-qrcode'

import { LanguageContext } from '../locale/LanguageContext'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'
import Document from '../js/document'
import { countriesList } from '../assets/data/groupedCountries'

const api = process.env.REACT_APP_API

function Success() {
  const toast = useToast()
  const [show, setShow] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const languageContext = useContext(LanguageContext)
  const { colorMode } = useColorMode()
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
          description: message,
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
        description: err.message,
        status: 'error',
        isClosable: true,
        duration: null,
      })
    }
  }
  const bgColorQR = { light: 'white', dark: '#171923' }
  const fgColorQR = { light: '#171923', dark: 'white' }
  const overlayColor = {
    light: 'rgba(255,255,255,1)',
    dark: '#171923',
  }
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
        <WhiteBox p={[1, 8]}>
          <Heading textAlign="center" mb="12">
            <Trans id="yourCodesLabel" />
          </Heading>
          {declarationCodes?.map((declaration) => (
            <Flex
              mt="4"
              mb="16"
              d="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              key={declaration.code}>
              <Heading size="md">
                {declaration.name} {declaration.surname}
              </Heading>
              <Button
                variantColor="brand"
                variant="outline"
                size="lg"
                mt="8"
                w="256px"
                onClick={() => setShow(declaration.code)}
                cursor="zoom-in"
                fontWeight="bold"
                letterSpacing="4px">
                {declaration.code}
              </Button>
              <Button
                variantColor="brand"
                size="lg"
                mt="4"
                mb="8"
                w="256px"
                leftIcon="download"
                fontWeight="bold"
                disabled={disabled}
                isLoading={disabled}
                loadingText={<Trans id="downloading" />}
                onClick={() => download(declaration.code)}>
                <Trans id="download" />
              </Button>
              <QRCode
                bgColor={bgColorQR[colorMode]}
                fgColor={fgColorQR[colorMode]}
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
                <ModalOverlay backgroundColor={overlayColor[colorMode]} />
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
                      bgColor={bgColorQR[colorMode]}
                      fgColor={fgColorQR[colorMode]}
                      level="Q"
                      style={{ width: 300 }}
                      value={`${declaration.code}  ${declaration.cnp}`}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      variantColor="brand"
                      mr={3}
                      onClick={() => setShow(null)}>
                      <Trans id="close" />
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
            <Trans id="printNotice" />
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
            <Link to="/faq">
              <Button variantColor="brand" size="lg" mt="8" w="320px">
                <Trans id="questionsAnswers" />
              </Button>
            </Link>
            <Stack isInline mt="12">
              <a
                class="resp-sharing-button__link"
                href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fchestionar.stsisp.ro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="">
                <div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small">
                  <div
                    aria-hidden="true"
                    class="resp-sharing-button__icon resp-sharing-button__icon--normal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M18.77 7.5H14.5V5.6c0-.9.6-1.1 1-1.1h3V.54L14.17.53C10.24.54 9.5 3.48 9.5 5.37V7.5h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </div>
                </div>
              </a>
              <a
                class="resp-sharing-button__link"
                href="https://twitter.com/intent/tweet/?text=Covid-SAFE@Frontieră&amp;url=https%3A%2F%2Fchestionar.stsisp.ro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="">
                <div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small">
                  <div
                    aria-hidden="true"
                    class="resp-sharing-button__icon resp-sharing-button__icon--normal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M23.4 4.83c-.8.37-1.5.38-2.22.02.94-.56.98-.96 1.32-2.02-.88.52-1.85.9-2.9 1.1-.8-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.04.7.12 1.04-3.78-.2-7.12-2-9.37-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.73-.03-1.43-.23-2.05-.57v.06c0 2.2 1.57 4.03 3.65 4.44-.67.18-1.37.2-2.05.08.57 1.8 2.25 3.12 4.24 3.16-1.95 1.52-4.36 2.16-6.74 1.88 2 1.3 4.4 2.04 6.97 2.04 8.36 0 12.93-6.92 12.93-12.93l-.02-.6c.9-.63 1.96-1.22 2.57-2.14z" />
                    </svg>
                  </div>
                </div>
              </a>

              <a
                class="resp-sharing-button__link"
                href="mailto:?subject=Covid-SAFE@Frontieră"
                target="_self"
                rel="noopener noreferrer"
                aria-label="">
                <div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small">
                  <div
                    aria-hidden="true"
                    class="resp-sharing-button__icon resp-sharing-button__icon--normal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M23.5 18c0 .8-.7 1.5-1.5 1.5H2c-.8 0-1.5-.7-1.5-1.5V6c0-.8.7-1.5 1.5-1.5h20c.8 0 1.5.7 1.5 1.5v12zm-3-9.5L12 14 3.5 8.5m0 7.5L7 14m13.5 2L17 14" />
                    </svg>
                  </div>
                </div>
              </a>
            </Stack>
          </Box>
        </WhiteBox>
      )}
    </Layout>
  )
}
export default Success
