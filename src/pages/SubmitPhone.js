import React, { useContext, useState } from 'react'
import { useHistory, useLocation, Link as RLink } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { ReCaptcha } from 'react-recaptcha-v3'
import { omit } from 'ramda'
import Select, { components } from 'react-select'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import { LanguageContext } from '../locale/LanguageContext'
import { groupedPhoneCodes } from '../assets/data/groupedCountries'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Heading,
  Box,
  Text,
  Link,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  useToast,
  Button,
  useColorModeValue,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'

const initialValues = {
  phone_country_prefix: { label: 'România', value: '+40' },
  phone: '',
  recaptcha: '',
}

const SingleValue = (props) => (
  <components.SingleValue {...props}>{props.data.value}</components.SingleValue>
)

const api = process.env.REACT_APP_API

function SubmitPhone() {
  const toast = useToast()
  let history = useHistory()
  let location = useLocation()
  const languageContext = useContext(LanguageContext)
  const [disabled, setDisabled] = useState(false)
  const [submitCount] = useLocalStorage('submitCount')
  if (location?.state?.message) {
    toast({
      title: languageContext.dictionary['startHere'],
      description: location?.state?.message,
      status: 'info',
      duration: 4000,
    })
  }
  const bgColor = useColorModeValue('#fff', '#171923')
  const color = useColorModeValue('#171923', '#fff')
  const borderColor = useColorModeValue('#e7ebed', '#4a4a4a')
  const optionColor = useColorModeValue(
    { selected: '#2653B0', regular: '#4a4a4a' },
    { selected: '#ffffff', regular: '#e7ebed' }
  )
  const optionHover = useColorModeValue(
    { focused: '#a8bfda', regular: '#ffffff' },
    { focused: '#171923', regular: '#4a4a4a' }
  )
  const customStyles = {
    control: (styles, state) => ({
      ...styles,
      'backgroundColor': 'transparent',
      'border': 'none',
      'borderRadius': 0,
      'height': '2.5rem',
      'borderBottom': state.isFocused
        ? 'solid 2px #3182ce'
        : 'solid 2px #e7ebed',
      ':hover': {
        ...styles[':hover'],
        borderColor: '#3182ce',
      },
    }),

    singleValue: (styles) => ({
      ...styles,
      right: 10,
      color: color,
    }),
    container: (styles) => ({
      ...styles,
      width: '100%',
    }),
    menu: (styles) => ({
      ...styles,
      width: 'auto',
      borderColor: borderColor,
      borderWidth: '1px',
      backgroundColor: bgColor,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? optionColor.selected : optionColor.regular,
      backgroundColor: state.isFocused
        ? optionHover.focused
        : optionHover.regular,
    }),
  }
  const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  }
  const formatGroupLabel = (data) => (
    <Flex alignItems="center" justifyContent="space-between">
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </Flex>
  )

  return (
    <Layout title="Telefon">
      <WhiteBox p={[2, 8, 8, 8]}>
        <Heading size="md" lineHeight="32px" fontWeight="400">
          <Trans id="validatePhoneNumberInformationLabel" />
        </Heading>
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {}
            if (!values.phone) {
              errors.phone = languageContext.dictionary['required']
            } else if (!values.phone.match(/^[0-9]+$/)) {
              errors.phone = languageContext.dictionary['numbersOnly']
            }
            if (!values.phone_country_prefix) {
              errors.phone_country_prefix =
                languageContext.dictionary['required']
            }
            if (!values.recaptcha) {
              errors.recaptcha = languageContext.dictionary['required']
            }

            return errors
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const payload = {
              ...values,
              phone_country_prefix: values.phone_country_prefix.value,
            }
            try {
              const request = await fetch(`${api}/phone/validate`, {
                method: 'POST',
                headers: {
                  'X-API-KEY': process.env.REACT_APP_API_KEY,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(omit(['recaptcha'], payload)),
              })
              const response = await request.json()
              if (response.status === 'success') {
                writeStorage('submitCount', !submitCount ? 1 : submitCount + 1)
                toast({
                  title: languageContext.dictionary['sms'],
                  description: languageContext.dictionary['smsDescription'],
                  status: 'success',
                  duration: 2000,
                  isClosable: true,
                })
                writeStorage('phone', {
                  phone_country_prefix: values.phone_country_prefix.value,
                  phone: values.phone,
                })
                setDisabled(true)
                setTimeout(() => {
                  history.push('/validare-telefon')
                }, 3000)
              } else {
                setSubmitting(false)
                setDisabled(false)
                toast({
                  title: languageContext.dictionary['error'],
                  description:
                    response.message === 'Validation failure'
                      ? languageContext.dictionary['incorrectNumber']
                      : response.message,
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
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Field name="phone_country_prefix">
                {(props) => (
                  <Field name="phone">
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={form.errors.phone && form.touched.phone}>
                        <FormLabel htmlFor="phone" mt="8">
                          <Trans id="telefon" />
                        </FormLabel>
                        <InputGroup size="md" width="80%">
                          <InputLeftAddon
                            w="100px"
                            p="0"
                            border="none"
                            borderImageWidth="0"
                            backgroundColor={bgColor}
                            color={color}>
                            <Select
                              {...props.field}
                              name="phone_country_prefix"
                              options={groupedPhoneCodes}
                              formatGroupLabel={formatGroupLabel}
                              placeholder={<Trans id="phoneCode" />}
                              onChange={(val) =>
                                setFieldValue('phone_country_prefix', val)
                              }
                              components={{ SingleValue }}
                              styles={customStyles}
                            />
                          </InputLeftAddon>
                          <Input
                            {...field}
                            name="phone"
                            pl="4"
                            variant="flushed"
                            placeholder="72600000"
                          />
                          <InputRightElement
                            children={
                              values.phone !== '' &&
                              !form.errors.phone &&
                              form.touched.phone ? (
                                <CheckIcon color="green.500" />
                              ) : null
                            }
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />
                          {form.errors.phone}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}
              </Field>
              <Field name="recaptcha">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={form.errors.recaptcha && form.touched.recaptcha}>
                    <ReCaptcha
                      sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                      action="submit"
                      theme="dark"
                      verifyCallback={(response) => {
                        setFieldValue('recaptcha', response)
                      }}
                    />
                    <FormErrorMessage>
                      <WarningIcon color="red.500" marginRight="2" />
                      {form.errors.recaptcha}
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
                  disabled={disabled || values.recaptcha === ''}
                  isLoading={isSubmitting}
                  type="submit">
                  <Trans id="validatePhoneNumber" />
                </Button>
                {submitCount > 2 && (
                  <Link as={RLink} to="/descarca-tip" mt="8">
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      size="lg"
                      w="300px"
                      isLoading={isSubmitting}>
                      <Trans id="downloadPage" />
                    </Button>
                  </Link>
                )}
              </Box>
            </Form>
          )}
        </Formik>
        <Text fontSize="xs">
          <Trans id="recaptcha" />{' '}
          <Link
            isExternal
            href="https://policies.google.com/privacy"
            color="brand.500">
            <Trans id="privacy" />
          </Link>{' '}
          <Trans id="and" />{' '}
          <Link
            isExternal
            color="brand.500"
            href="https://policies.google.com/terms">
            <Trans id="terms" />
          </Link>{' '}
          <Trans id="apply" />.
        </Text>
      </WhiteBox>
    </Layout>
  )
}
export default SubmitPhone
