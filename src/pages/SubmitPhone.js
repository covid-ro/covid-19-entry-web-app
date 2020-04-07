import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import Select, { components } from 'react-select'
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
const formatGroupLabel = data => (
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
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 0,
    height: '2.5rem',
    borderBottom: 'solid 2px #e7ebed',
    ':active': {
      ...styles[':active'],
      borderColor: '#3182ce',
    },
    ':hover': {
      ...styles[':hover'],
      borderColor: '#e7ebed',
    },
  }),

  singleValue: styles => ({ ...styles, right: 10 }),
  container: styles => ({
    ...styles,
    width: '100%',
  }),
  menu: styles => ({
    ...styles,
    display: 'block',
    width: 'auto',
  }),
}
const SingleValue = props => (
  <components.SingleValue {...props}>{props.data.value}</components.SingleValue>
)

export function SubmitPhone() {
  let history = useHistory()
  const languageContext = useContext(LanguageContext)

  return (
    <WhiteBox>
      <Heading size="md" lineHeight="32px" fontWeight="400">
        <Trans id="validatePhoneNumberInformationLabel" />
      </Heading>
      <Formik
        initialValues={initialValues}
        validate={values => {
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
        onSubmit={values => {
          const payload = `${values.phone_country_prefix.value}${values.phone}`
          console.log('onSubmit -> values', payload)
          // return await fetch('/phone/validate', {
          //   method: 'POST',
          //   headers: {
          //     'X-API-KEY': process.env.REACT_APP_API_KEY,
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ values }),
          // })
          history.push('/validare-telefon')
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
            <Field name="phone_country_prefix">
              {props => (
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
                            onChange={val =>
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
