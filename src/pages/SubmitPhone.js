import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import Select, { components } from 'react-select'
import { writeStorage } from '@rehooks/local-storage'
import { LanguageContext } from '../locale/LanguageContext'
import { groupedPhoneCodes } from '../assets/data/groupedCountries'

import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Icon,
  useToast,
  Button,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'

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
const initialValues = {
  phone_country_prefix: { label: 'România', value: '+40' },
  phone: '',
}
const customStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 0,
    height: '2.5rem',
    borderBottom: state.isFocused ? 'solid 2px #3182ce' : 'solid 2px #e7ebed',
    ':hover': {
      ...styles[':hover'],
      borderColor: '#3182ce',
    },
  }),

  singleValue: (styles) => ({ ...styles, right: 10 }),
  container: (styles) => ({
    ...styles,
    width: '100%',
  }),
  menu: (styles) => ({
    ...styles,
    width: 'auto',
  }),
}
const SingleValue = (props) => (
  <components.SingleValue {...props}>{props.data.value}</components.SingleValue>
)
const api = process.env.REACT_APP_API

export function SubmitPhone() {
  const toast = useToast()
  let history = useHistory()
  const languageContext = useContext(LanguageContext)

  return (
    <WhiteBox>
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
            errors.phone_country_prefix = languageContext.dictionary['required']
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
              body: JSON.stringify(payload),
            })
            const response = await request.json()
            if (response.status === 'success') {
              toast({
                title: <Trans id="sms" />,
                description: <Trans id="smsDescription" />,
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
              writeStorage('phone', {
                phone_country_prefix: values.phone_country_prefix.value,
                phone: values.phone,
              })
              setTimeout(() => {
                setSubmitting(false)
                history.push('/validare-telefon')
              }, 3000)
            } else {
              setSubmitting(false)
              toast({
                title: <Trans id="error" />,
                description: response.message,
                status: 'error',
                isClosable: true,
                duration: null,
              })
            }
          } catch (error) {
            setSubmitting(false)
            toast({
              title: <Trans id="error" />,
              description: error.message,
              status: 'error',
              isClosable: true,
              duration: null,
            })
          }
        }}>
        {({ isSubmitting, setFieldValue }) => (
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
                      <InputGroup>
                        <InputLeftAddon
                          w="100px"
                          px="0"
                          border="none"
                          borderImageWidth="0"
                          backgroundColor="#fff">
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
                          w="70%"
                        />
                        <InputRightElement
                          children={
                            !form.errors.phone &&
                            form.touched.phone && (
                              <Icon name="check" color="green.500" />
                            )
                          }
                        />
                      </InputGroup>
                      <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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
                // isDisabled={}
                isLoading={isSubmitting}
                type="submit">
                <Trans id="validatePhoneNumber" />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </WhiteBox>
  )
}
