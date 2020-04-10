import React, { useState, useEffect, useContext } from 'react'
import { Formik, Form, Field } from 'formik'
import { useHistory, Link as RLink } from 'react-router-dom'
import { LanguageContext } from '../locale/LanguageContext'

import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  InputGroup,
  InputRightElement,
  Icon,
  Input,
  Text,
  Link,
  Button,
  Progress,
  Flex,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
const api = process.env.REACT_APP_API

export function ValidatePhone() {
  let history = useHistory()
  const languageContext = useContext(LanguageContext)

  const [seconds, decrement] = useState(30)
  const [progress, increment] = useState(0)
  useEffect(() => {
    if (seconds > 0) {
      const progressLevel = setInterval(() => {
        increment(progress + 3.3333333)
        decrement(seconds - 1)
      }, 1000)
      return () => clearInterval(progressLevel)
    }
  }, [progress, seconds])
  return (
    <Flex flexDirection="column" w="100%">
      <WhiteBox>
        <Flex flexDirection="row" width="100%" alignItems="center">
          <Progress value={progress} height="2px" w="90%" grow={1} />
          <Text ml="auto">00:{seconds < 10 ? `0${seconds}` : seconds}</Text>
        </Flex>
      </WhiteBox>
      <WhiteBox>
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
          onSubmit={async (values) => {
            const local = JSON.parse(localStorage.getItem('phone'))
            const payload = {
              ...values,
              phone_country_prefix: local.values.phone_country_prefix.value,
              phone: local.values.phone,
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
                localStorage.setItem('token', response.token)
                history.push('/declaratie')
              } else {
                console.log(response.status)
              }
            } catch (error) {
              console.log(error.message)
            }
          }}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
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
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>

                    <FormErrorMessage>
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
                  variantColor="brand"
                  size="lg"
                  mt="8"
                  w="320px"
                  disabled={seconds === 0}
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
  )
}
