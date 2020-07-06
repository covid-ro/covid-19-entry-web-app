import React, { useContext, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useHistory, Link as RLink } from 'react-router-dom'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'

import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Link,
  Button,
  Progress,
  Flex,
  useToast,
} from '@chakra-ui/core'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import { Layout } from '../components/Layout'
import { LanguageContext } from '../locale/LanguageContext'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { useCountdown } from '../utils/useCountdown'
const api = process.env.REACT_APP_API

function ValidatePhone() {
  let history = useHistory()
  const toast = useToast()
  const languageContext = useContext(LanguageContext)
  const [disabled, setDisabled] = useState(false)
  const [progress, minutes, seconds] = useCountdown(30)
  const [local] = useLocalStorage('phone')
  return (
    <Layout title="Validare telefon">
      <Flex flexDirection="column" w="100%">
        <WhiteBox p={[2, 8, 8, 8]}>
          <Flex flexDirection="row" width="100%" alignItems="center">
            <Progress value={progress} height="2px" w="90%" grow={1} />
            <Text ml="auto">{`${minutes}:${seconds}`}</Text>
          </Flex>
        </WhiteBox>
        <WhiteBox p={[2, 8, 8, 8]}>
          <Heading size="md" lineHeight="32px" fontWeight="400">
            <Trans id="addSMSCode" />
          </Heading>
          <Formik
            initialValues={{ phone_validation_code: '' }}
            validate={(values) => {
              const errors = {}
              if (!values.phone_validation_code) {
                errors.phone_validation_code =
                  languageContext.dictionary['required']
              } else if (values.phone_validation_code.length !== 6) {
                errors.phone_validation_code =
                  languageContext.dictionary['codeError']
              }
              return errors
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const payload = {
                ...values,
                phone_country_prefix: local?.phone_country_prefix,
                phone: local?.phone,
              }
              try {
                const request = await fetch(`${api}/phone/check`, {
                  method: 'POST',
                  headers: {
                    'X-API-KEY': process.env.REACT_APP_API_KEY,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                })
                const response = await request.json()
                if (response.status === 'success') {
                  writeStorage('token', response.token)
                  writeStorage('submitCount', 0)
                  toast({
                    title: languageContext.dictionary['success'],
                    description: languageContext.dictionary['validateSuccess'],
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
                  setDisabled(true)
                  setTimeout(() => {
                    history.push('/declaratie')
                  }, 3000)
                } else {
                  setSubmitting(false)
                  setDisabled(false)
                  let message
                  switch (response.message) {
                    case 'Invalid value for parameter: code':
                      message = languageContext.dictionary['incorrectCode']
                      break
                    default:
                      message = languageContext.dictionary['unknownError']
                  }
                  toast({
                    title: languageContext.dictionary['error'],
                    description: message,
                    status: 'error',
                    isClosable: true,
                    duration: null,
                  })
                }
              } catch (error) {
                setSubmitting(false)
                setDisabled(false)
                toast({
                  title: languageContext.dictionary['error'],
                  description: error.message,
                  status: 'error',
                  isClosable: true,
                  duration: null,
                })
              }
            }}>
            {({ isSubmitting }) => (
              <Form>
                <Field name="phone_validation_code">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.phone_validation_code &&
                        form.touched.phone_validation_code
                      }>
                      <FormLabel htmlFor="phone_validation_code" mt="20">
                        <Trans id="codValidareSMS" />
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          name="phone_validation_code"
                          variant="flushed"
                          placeholder="123456"
                        />
                        <InputRightElement
                          children={
                            !form.errors.phone_validation_code &&
                            form.touched.phone_validation_code && (
                              <CheckIcon color="green.500" />
                            )
                          }
                        />
                      </InputGroup>

                      <FormErrorMessage>
                        <WarningIcon color="red.500" marginRight="2" />
                        {form.errors.phone_validation_code}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Box
                  mt="4"
                  mb="16"
                  d="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center">
                  <Button
                    colorScheme="brand"
                    size="lg"
                    mt="8"
                    w="300px"
                    disabled={progress === 100 || disabled}
                    isLoading={isSubmitting}
                    type="submit">
                    <Trans id="save" />
                  </Button>
                  <Text pt="4">
                    <Trans id="dontReceiveTheCode" />
                  </Text>
                  <Link
                    as={RLink}
                    to="/introducere-telefon"
                    pt="2"
                    color="brand.800">
                    <Trans id="resendSMSCod" />
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </WhiteBox>
      </Flex>
    </Layout>
  )
}
export default ValidatePhone
