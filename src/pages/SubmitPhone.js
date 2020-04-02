import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { LanguageContext } from '../locale/LanguageContext'

import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Icon,
  Button,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
const initialValues = {
  phone_country_prefix: '40',
  phone: '',
}
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
          }
          if (!values.phone_country_prefix) {
            errors.phone_country_prefix = languageContext.dictionary['required']
          }
          return errors
        }}
        onSubmit={values => {
          console.log('onSubmit -> values', values)
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
                      isInvalid={
                        props.form.errors.phone_country_prefix &&
                        props.form.touched.phone_country_prefix &&
                        form.errors.phone &&
                        form.touched.phone
                      }>
                      <FormLabel htmlFor="phone" mt="8">
                        <Trans id="telefon" />
                      </FormLabel>
                      <InputGroup>
                        <InputLeftAddon>
                          <Input
                            {...props.field}
                            name="phone_country_prefix"
                            variant="flushed"
                            w="30px"
                            placeholder="40"
                            textAlign="right"
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
                            !props.form.errors.phone_country_prefix &&
                            !form.errors.phone &&
                            !props.form.touched.phone_country_prefix &&
                            form.touched.phone && (
                              <Icon name="check" color="green.500" />
                            )
                          }
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        <p>{props.form.errors.phone}</p>
                        <p>{form.errors.phone}</p>
                      </FormErrorMessage>
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
