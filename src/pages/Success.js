import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import format from 'date-fns/format'
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

export function Success() {
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
        documentDate: format(new Date(declaration.created_at), 'dd-MM-yyyy'),
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
                bgColor="#FFFFFF"
                fgColor="#000000"
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
                <ModalOverlay backgroundColor={'rgba(255,255,255,1)'} />
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
                      bgColor="#FFFFFF"
                      fgColor="#000000"
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
          </Box>
        </WhiteBox>
      )}
    </Layout>
  )
}
