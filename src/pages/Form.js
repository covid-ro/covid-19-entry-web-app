import React, { useState, useContext } from 'react'
import { Formik, Field, Form } from 'formik'
import ro from 'date-fns/locale/ro'
import ReactSelect from 'react-select'
import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  RadioButtonGroup,
  Select,
  Slider,
  Button,
  Flex,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { CustomRadio } from '../components/CustomRadio'
import { LanguageContext } from '../locale/LanguageContext'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]
const initialValues = {
  surname: '',
  name: '',
  cnp: '',
  email: '',
  border_checkpoint_id: null,
  document_type: 'passport',
  document_series: '',
  document_number: '',
  travelling_from_country_code: '',
  travelling_from_city: '',
  travelling_from_date: '',
  itinerary_countries: [],
  isolation_addresses: {
    city: '',
    county: '',
    city_full_address: '',
    city_arrival_date: '',
    city_departure_date: '',
  },
  q_visited: true,
  q_contacted: true,
  q_hospitalized: true,
  symptom_fever: true,
  symptom_swallow: true,
  symptom_breathing: true,
  symptom_cough: true,

  vehicle_type: 'auto',
  vehicle_registration_no: '',
}
export function Declaration() {
  const languageContext = useContext(LanguageContext)
  const maxStep = 10
  const [step, setSlide] = useState(1)
  return (
    <Flex flexDirection="column" w="100%">
      <WhiteBox pos="sticky">
        <Flex flexDirection="row" width="100%" alignItems="center">
          <Slider
            defaultValue={0}
            height="2px"
            value={step}
            max={maxStep}
            min={0}
            step={1}
            w="87%"
            grow={1}
            color="brand">
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb />
          </Slider>
          <Text ml="auto" color="brand.800">
            {step} din {maxStep}
          </Text>
        </Flex>
      </WhiteBox>
      <Formik
        initialValues={initialValues}
        validate={values => {
          const errors = {}
          if (!values.surname) {
            errors.surname = languageContext.dictionary['required']
          }
          if (!values.name) {
            errors.name = languageContext.dictionary['required']
          }
          if (!values.cnp) {
            errors.cnp = languageContext.dictionary['required']
          }
          // if (!values.document_series) {
          //   errors.document_series = languageContext.dictionary['required']
          // }
          if (!values.document_number) {
            errors.document_number = languageContext.dictionary['required']
          }
          if (!values.travelling_from_city) {
            errors.travelling_from_city = languageContext.dictionary['required']
          }
          if (!values.travelling_from_date) {
            errors.travelling_from_date = languageContext.dictionary['required']
          }
          if (!values.isolation_addresses.county) {
            errors.county = languageContext.dictionary['required']
          }
          if (!values.isolation_addresses.city) {
            errors.city = languageContext.dictionary['required']
          }
          if (!values.isolation_addresses.city_arrival_date) {
            errors.city_arrival_date = languageContext.dictionary['required']
          }
          if (!values.isolation_addresses.city_departure_date) {
            errors.city_departure_date = languageContext.dictionary['required']
          }
          if (!values.isolation_addresses.city_full_address) {
            errors.city_full_address = languageContext.dictionary['required']
          }
          if (!values.email) {
            errors.email = languageContext.dictionary['required']
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = languageContext.dictionary['invalidEmail']
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          const payload = {
            ...values,
            itinerary_countries: values.itinerary_countries.map(c => c.value),
            isolation_addresses: [values.isolation_addresses],
          }
          console.log('onSubmit -> values', payload)
          // return await fetch('/phone/validate', {
          //   method: 'POST',
          //   headers: {
          //     'X-API-KEY': process.env.REACT_APP_API_KEY,
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ values }),
          // })
          // history.push('/')}
        }}>
        {({ values, errors, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form>
            {/* Step 1 */}
            <WhiteBox onClick={() => setSlide(1)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form1Label" />
              </Heading>
              <Field name="surname">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={form.errors.surname && form.touched.surname}>
                    <FormLabel htmlFor="name" mt="8">
                      <Trans id="nume" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="surname"
                        variant="flushed"
                        placeholder="de ex.: Nicolaescu"
                      />
                      <InputRightElement
                        children={
                          !form.errors.surname &&
                          form.touched.surname && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.surname}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="name">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="name" mt="4">
                      <Trans id="prenume" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="name"
                        variant="flushed"
                        placeholder="de ex.: Ion"
                      />
                      <InputRightElement
                        children={
                          !form.errors.name &&
                          form.touched.name && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="cnp">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={form.errors.cnp && form.touched.cnp}>
                    <FormLabel htmlFor="cnp" mt="4">
                      <Trans id="cnp" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        name="cnp"
                        {...field}
                        variant="flushed"
                        placeholder="de ex.: 179....."
                      />
                      <InputRightElement
                        children={
                          !form.errors.cnp &&
                          form.touched.cnp && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.cnp}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </WhiteBox>
            {/* Step 2 */}
            <WhiteBox onClick={() => setSlide(2)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form2Label" />
              </Heading>
              <RadioButtonGroup
                defaultValue="passport"
                name="document_type"
                d="flex"
                flexDirection="row"
                justifyContent="space-around"
                my="8"
                onChange={val => setFieldValue('document_type', val)}
                isInline>
                >
                <CustomRadio value="passport">
                  <Trans id="passport" />
                </CustomRadio>
                <CustomRadio value="identity_card">
                  <Trans id="card" />
                </CustomRadio>
              </RadioButtonGroup>
              {values.document_type === 'passport' ? (
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="addPassportInfo" />
                </Heading>
              ) : (
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="addICInfo" />
                </Heading>
              )}
              {values.document_type !== 'passport' && (
                <Field name="document_series">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={
                        form.errors.document_series &&
                        form.touched.document_series
                      }>
                      <FormLabel htmlFor="document_series" mt="4">
                        <Trans id="seria" />
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          name="document_series"
                          variant="flushed"
                          isRequired
                          placeholder="de ex.: AA"
                        />
                        <InputRightElement
                          children={
                            !form.errors.document_series &&
                            form.touched.document_series && (
                              <Icon name="check" color="green.500" />
                            )
                          }
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.document_series}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              )}
              <Field name="document_number">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.document_number &&
                      form.touched.document_number
                    }>
                    <FormLabel htmlFor="document_number" mt="4">
                      <Trans id="passportNumber" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="document_number"
                        variant="flushed"
                        isRequired
                        placeholder="de ex.: 179....."
                      />
                      <InputRightElement
                        children={
                          !form.errors.document_number &&
                          form.touched.document_number && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.document_number}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </WhiteBox>
            {/* Step 3 */}
            <WhiteBox onClick={() => setSlide(3)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form3Label" />
              </Heading>
              <Field name="travelling_from_country_code">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.travelling_from_country_code &&
                      form.touched.travelling_from_country_code
                    }>
                    <FormLabel htmlFor="travelling_from_country_code" mt="8">
                      <Trans id="country" />
                    </FormLabel>
                    <Select
                      {...field}
                      placeholder={languageContext.dictionary['selectCountry']}
                      variant="flushed"
                      isRequired
                      name="travelling_from_country_code">
                      {options.map(option => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {form.errors.travelling_from_country_code}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="travelling_from_city">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.travelling_from_city &&
                      form.touched.travelling_from_city
                    }>
                    <FormLabel htmlFor="travelling_from_city" mt="4">
                      <Trans id="city" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="travelling_from_city"
                        variant="flushed"
                        isRequired
                        placeholder="de ex.: Viena"
                      />
                      <InputRightElement
                        children={
                          !form.errors.travelling_from_city &&
                          form.touched.travelling_from_city && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.travelling_from_city}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="travelling_from_date">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.travelling_from_date &&
                      form.touched.travelling_from_date
                    }>
                    <FormLabel htmlFor="travelling_from_date" mt="4">
                      <Trans id="dataPlecarii" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        type="date"
                        value={values.travelling_from_date}
                        name="travelling_from_date"
                        variant="flushed"
                        isRequired
                      />
                      <InputRightElement
                        children={
                          !form.errors.travelling_from_date &&
                          form.touched.travelling_from_date && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {form.errors.travelling_from_date}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Heading
                size="md"
                lineHeight="32px"
                fontWeight="400"
                mt="8"
                mb="4">
                <Trans id="transitedCountries" />
              </Heading>
              <Field name="itinerary_countries">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.itinerary_countries &&
                      form.touched.itinerary_countries
                    }>
                    <ReactSelect
                      {...field}
                      placeholder={<Trans id="selectCountries" />}
                      name="itinerary_countries"
                      isMulti
                      options={options}
                      onChange={val =>
                        setFieldValue('itinerary_countries', val)
                      }
                      mt="4"
                    />
                    <FormErrorMessage>
                      {form.errors.itinerary_countries}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </WhiteBox>
            {/* Step 4 */}
            <WhiteBox onClick={() => setSlide(4)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form4Label" />
              </Heading>
              <Field name="isolation_addresses.county">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.county &&
                      form.touched?.isolation_addresses?.county
                    }>
                    <FormLabel htmlFor="isolation_addresses.county" mt="8">
                      <Trans id="judet" />
                    </FormLabel>
                    <Select
                      {...field}
                      placeholder={languageContext.dictionary['selectCounty']}
                      variant="flushed"
                      isRequired
                      name="isolation_addresses.county">
                      {options.map(option => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{form.errors.county}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="isolation_addresses.city">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.city &&
                      form.touched?.isolation_addresses?.city
                    }>
                    <FormLabel htmlFor="isolation_addresses.city" mt="4">
                      <Trans id="city" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="isolation_addresses.city"
                        variant="flushed"
                        placeholder="de ex.: Viena"
                      />
                      <InputRightElement
                        children={
                          !form.errors.city &&
                          form.touched?.isolation_addresses?.city && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="isolation_addresses.city_arrival_date">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.city_arrival_date &&
                      form.touched?.isolation_addresses?.city_arrival_date
                    }>
                    <FormLabel
                      htmlFor="isolation_addresses.city_arrival_date"
                      mt="4">
                      <Trans id="dataSosirii" />
                    </FormLabel>
                    <Input
                      {...field}
                      type="date"
                      locale={ro}
                      name="isolation_addresses.city_arrival_date"
                      variant="flushed"
                    />
                    <FormErrorMessage>
                      {form.errors.city_arrival_date}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="isolation_addresses.city_departure_date">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.city_departure_date &&
                      form.touched?.isolation_addresses?.city_departure_date
                    }>
                    <FormLabel
                      htmlFor="isolation_addresses.city_departure_date"
                      mt="4">
                      <Trans id="dataPlecarii" />
                    </FormLabel>
                    <Input
                      type="date"
                      {...field}
                      name="isolation_addresses.city_departure_date"
                      variant="flushed"
                    />
                    <FormErrorMessage>
                      {form.errors.city_departure_date}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="isolation_addresses.city_full_address">
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.city_full_address &&
                      form.touched?.isolation_addresses?.city_full_address
                    }>
                    <FormLabel
                      htmlFor="isolation_addresses.city_full_address"
                      mt="4">
                      <Trans id="adresaCompleta" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="isolation_addresses.city_full_address"
                        variant="flushed"
                        placeholder="de ex.: Str. Emil Custode, nr. 12"
                      />
                      <InputRightElement
                        children={
                          !form.errors.city_full_address &&
                          form.touched?.isolation_addresses
                            ?.city_full_address && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {form.errors.city_full_address}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </WhiteBox>
            {/* Step 5 */}
            <WhiteBox onClick={() => setSlide(5)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form5Label" />
              </Heading>
              <FormControl isRequired>
                <FormLabel htmlFor="email" mt="4">
                  <Trans id="telefon" />
                </FormLabel>
                <InputGroup>
                  <Input
                    isDisabled
                    variant="flushed"
                    value="tel from localstorage"
                  />
                  <InputRightElement
                    children={<Icon name="check" color="green.500" />}
                  />
                </InputGroup>
              </FormControl>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}>
                    <FormLabel htmlFor="email" mt="4">
                      <Trans id="email" />
                    </FormLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        name="email"
                        variant="flushed"
                        placeholder={
                          languageContext.dictionary['emailPlaceholder']
                        }
                      />
                      <InputRightElement
                        children={
                          !form.errors.email &&
                          form.touched.email && (
                            <Icon name="check" color="green.500" />
                          )
                        }
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {form.errors.city_full_address}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </WhiteBox>
            {/* Step 6 */}
            <WhiteBox onClick={() => setSlide(6)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form6FirstQuestion" />
              </Heading>
              <RadioButtonGroup
                value={values.q_visited}
                name="q_visited"
                d="flex"
                flexDirection="row"
                justifyContent="space-around"
                my="8"
                onChange={val => setFieldValue('q_visited', val)}
                isInline>
                >
                <CustomRadio value={true}>
                  <Trans id="da" />
                </CustomRadio>
                <CustomRadio value={false}>
                  <Trans id="nu" />
                </CustomRadio>
              </RadioButtonGroup>
            </WhiteBox>
            {/* Step 7 */}
            <WhiteBox onClick={() => setSlide(7)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form7Label" />
              </Heading>
              <RadioButtonGroup
                value={values.q_contacted}
                name="q_contacted"
                d="flex"
                flexDirection="row"
                justifyContent="space-around"
                my="8"
                onChange={val => setFieldValue('q_contacted', val)}
                isInline>
                >
                <CustomRadio value={true}>
                  <Trans id="da" />
                </CustomRadio>
                <CustomRadio value={false}>
                  <Trans id="nu" />
                </CustomRadio>
              </RadioButtonGroup>
            </WhiteBox>
            {/* Step 8 */}
            <WhiteBox onClick={() => setSlide(8)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form6SecondQuestion" />
              </Heading>
              <RadioButtonGroup
                value={values.q_hospitalized}
                name="q_hospitalized"
                d="flex"
                flexDirection="row"
                justifyContent="space-around"
                my="8"
                onChange={val => setFieldValue('q_hospitalized', val)}
                isInline>
                >
                <CustomRadio value={true}>
                  <Trans id="da" />
                </CustomRadio>
                <CustomRadio value={false}>
                  <Trans id="nu" />
                </CustomRadio>
              </RadioButtonGroup>
            </WhiteBox>
            {/* Step 9 */}
            <WhiteBox onClick={() => setSlide(8)}>
              <Heading size="md" lineHeight="32px" fontWeight="400">
                <Trans id="form8Label" />
              </Heading>
              <Flex flexDirection="row" justifyContent="space-around" my="8">
                <CustomRadio value={true}>
                  <Trans id="da" />
                </CustomRadio>
                <CustomRadio value={false}>
                  <Trans id="nu" />
                </CustomRadio>
                <CustomRadio value={true}>
                  <Trans id="da" />
                </CustomRadio>
                <CustomRadio value={false}>
                  <Trans id="nu" />
                </CustomRadio>
              </Flex>
            </WhiteBox>
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
                <Trans id="trimite" />
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Flex>
  )
}
