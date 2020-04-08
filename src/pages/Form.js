import React, { useState, useContext, useRef } from 'react'
import { Formik, Field, Form } from 'formik'
import { Persist } from 'formik-persist'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import ro from 'date-fns/locale/ro'
import ReactSelect from 'react-select'
import SignaturePad from 'react-signature-canvas'
import fetcher from '../utils/fetcher'
import useSWR from 'swr'
import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  CheckboxGroup,
  FormControl,
  CloseButton,
  VisuallyHidden,
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
  ButtonGroup,
} from '@chakra-ui/core'
import '../assets/css/sigStyles.css'
import '@reach/dialog/styles.css'
import { groupedCountries } from '../assets/data/groupedCountries'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { CustomRadio } from '../components/CustomRadio'
import { CustomCheckBox } from '../components/CustomCheckBox'
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
  border_checkpoint_id: '',
  document_type: 'passport',
  document_series: '',
  document_number: '',
  travelling_from_country_code: '',
  travelling_from_city: '',
  travelling_from_date: '',
  itinerary_countries: [],
  travel_route: '',
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
  symptoms: [],
  vehicle_type: 'auto',
  vehicle_registration_no: '',
  signature: '',
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
const customStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 0,
    height: '2.5rem',
    boxShadow: 'none',
    borderBottom: state.isFocused ? 'solid 2px #3182ce' : 'solid 2px #e7ebed',
    ':hover': {
      ...styles[':hover'],
      borderColor: '#3182ce',
    },
  }),
  container: (styles, state) => ({
    ...styles,
    width: '100%',
  }),
  menu: (styles) => ({
    ...styles,
    width: '100%',
  }),
}

export function Declaration() {
  const { data } = useSWR('/border/checkpoint', fetcher)
  const sigCanvas = useRef({})
  const clear = () => sigCanvas.current.clear()

  const languageContext = useContext(LanguageContext)
  const maxStep = 14
  const [step, setSlide] = useState(1)
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
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
        validate={(values) => {
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
          if (!values.document_number) {
            errors.document_number = languageContext.dictionary['required']
          }
          if (!values.travelling_from_country_code) {
            errors.travelling_from_country_code =
              languageContext.dictionary['required']
          }
          // if (values.itinerary_countries.length === 0) {
          //   errors.itinerary_countries = languageContext.dictionary['required']
          // }
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
          if (values.signature === '') {
            errors.signature = languageContext.dictionary['required']
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          const payload = {
            ...values,
            itinerary_countries: values.itinerary_countries.map((c) => c.value),
            isolation_addresses: [values.isolation_addresses],
            border_checkpoint_id: values.border_checkpoint_id.id,
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
        {({
          values,
          errors,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => {
          return (
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
                  onChange={(val) => setFieldValue('document_type', val)}
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
                      <ReactSelect
                        {...field}
                        placeholder={
                          languageContext.dictionary['selectCountry']
                        }
                        name="travelling_from_country_code"
                        isClearable={true}
                        formatGroupLabel={formatGroupLabel}
                        options={groupedCountries}
                        onChange={(val) =>
                          setFieldValue('travelling_from_country_code', val)
                        }
                        onBlur={() =>
                          setFieldTouched(
                            'travelling_from_country_code',
                            true,
                            true
                          )
                        }
                        mt="4"
                        styles={customStyles}
                      />
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
                      isRequired
                      isInvalid={
                        form.errors.itinerary_countries &&
                        form.touched.itinerary_countries
                      }>
                      <ReactSelect
                        {...field}
                        placeholder={<Trans id="selectCountries" />}
                        name="itinerary_countries"
                        isMulti
                        isClearable={true}
                        formatGroupLabel={formatGroupLabel}
                        options={groupedCountries}
                        onChange={(val) =>
                          setFieldValue('itinerary_countries', val)
                        }
                        onBlur={() =>
                          setFieldTouched('itinerary_countries', true, true)
                        }
                        mt="4"
                        styles={customStyles}
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
                        {options.map((option) => (
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
                  <FormLabel htmlFor="phone" mt="4">
                    <Trans id="telefon" />
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name="phone"
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
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Heading
                  size="md"
                  lineHeight="32px"
                  fontWeight="400"
                  color="brand.500"
                  mt="8">
                  <Trans id="alertLabel" />
                </Heading>
                <Trans id="alertMessage" />
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
                  onChange={(val) => setFieldValue('q_visited', val)}
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
                  onChange={(val) => setFieldValue('q_contacted', val)}
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
                  onChange={(val) => setFieldValue('q_hospitalized', val)}
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
              <WhiteBox onClick={() => setSlide(9)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="form8Label" />
                </Heading>

                <CheckboxGroup
                  name="symptoms"
                  isInline
                  d="grid"
                  mt="8"
                  gridTemplateColumns="1fr 1fr"
                  gridGap="20px"
                  justifyContent="space-around"
                  justifyItems="center"
                  w="100%"
                  onChange={(val) => {
                    setFieldValue('symptoms', val)
                  }}>
                  <CustomCheckBox value="fever" justifySelf="center">
                    <Trans id="simptom1" />
                  </CustomCheckBox>
                  <CustomCheckBox value="swallow" justifySelf="center">
                    <Trans id="simptom2" />
                  </CustomCheckBox>
                  <CustomCheckBox value="breath" justifySelf="center">
                    <Trans id="simptom3" />
                  </CustomCheckBox>
                  <CustomCheckBox value="cough" justifySelf="center">
                    <Trans id="simptom4" />
                  </CustomCheckBox>
                </CheckboxGroup>
              </WhiteBox>
              {/* Step 10 */}
              <WhiteBox onClick={() => setSlide(10)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="form9Label" />
                </Heading>
                <RadioButtonGroup
                  value={values.vehicle_type}
                  name="vehicle_type"
                  d="flex"
                  flexDirection="row"
                  justifyContent="space-around"
                  my="8"
                  onChange={(val) => setFieldValue('vehicle_type', val)}
                  isInline>
                  >
                  <CustomRadio value="auto">
                    <Trans id="auto" />
                  </CustomRadio>
                  <CustomRadio value="ambulance">
                    <Trans id="ambulance" />
                  </CustomRadio>
                </RadioButtonGroup>
              </WhiteBox>
              {/* Step 11 */}
              <WhiteBox onClick={() => setSlide(11)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="form9Label2" />
                </Heading>

                <Field name="vehicle_registration_no">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.vehicle_registration_no &&
                        form.touched.vehicle_registration_no
                      }>
                      <FormLabel htmlFor="vehicle_registration_no" mt="4">
                        <Trans id="labelAutomobil" />
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          name="vehicle_registration_no"
                          variant="flushed"
                          placeholder={
                            languageContext.dictionary['placeholderAutomobil']
                          }
                        />
                        <InputRightElement
                          children={
                            !form.errors.vehicle_registration_no &&
                            form.touched.vehicle_registration_no && (
                              <Icon name="check" color="green.500" />
                            )
                          }
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.vehicle_registration_no}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </WhiteBox>
              {/* Step 12 */}
              <WhiteBox onClick={() => setSlide(12)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="form10Title" />
                </Heading>

                <Field name="travel_route">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.travel_route && form.touched.travel_route
                      }>
                      <FormLabel htmlFor="travel_route" mt="4">
                        <Trans id="form10Label" />
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          name="travel_route"
                          variant="flushed"
                          placeholder={
                            languageContext.dictionary['form10Placeholder']
                          }
                        />
                        <InputRightElement
                          children={
                            !form.errors.travel_route &&
                            form.touched.travel_route && (
                              <Icon name="check" color="green.500" />
                            )
                          }
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.travel_route}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </WhiteBox>
              {/* Step 13 */}
              <WhiteBox onClick={() => setSlide(13)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="form13Title" />
                </Heading>

                <Field name="border_checkpoint_id">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.border_checkpoint_id &&
                        form.touched.border_checkpoint_id
                      }>
                      <FormLabel htmlFor="border_checkpoint_id" mt="4">
                        <Trans id="form13Label" />
                      </FormLabel>
                      <ReactSelect
                        {...field}
                        placeholder={languageContext.dictionary['selectBorder']}
                        name="border_checkpoint_id"
                        isClearable={true}
                        options={data?.data}
                        getOptionLabel={(option) => option['name']}
                        getOptionValue={(option) => option['id']}
                        onChange={(val) =>
                          setFieldValue('border_checkpoint_id', val)
                        }
                        onBlur={() =>
                          setFieldTouched('border_checkpoint_id', true, true)
                        }
                        mt="4"
                        styles={customStyles}
                      />
                      <FormErrorMessage>
                        {form.errors.border_checkpoint_id}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </WhiteBox>
              {/* Step 14 */}
              <WhiteBox onClick={() => setSlide(14)}>
                <Heading size="md" lineHeight="32px" fontWeight="400">
                  <Trans id="signatureTitle" />
                </Heading>

                <Field name="signature">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={
                        form.errors.signature && form.touched.signature
                      }>
                      <Button
                        variantColor="brand"
                        variant="outline"
                        size="lg"
                        mt="8"
                        onClick={open}>
                        <Trans id="sign" />
                        {!form.errors.signature && form.touched.signature && (
                          <Icon name="check" color="green.500" ml="4" />
                        )}
                      </Button>
                      <DialogOverlay isOpen={showDialog} onDismiss={close}>
                        <DialogContent
                          aria-label="signature"
                          style={{
                            border: 'solid 2px #3585cf',
                            borderRadius: '8px',
                            position: 'relative',
                          }}>
                          <CloseButton
                            onClick={close}
                            pos="absolute"
                            backgroundColor="#fff"
                            right="10px"
                            top="10px">
                            <VisuallyHidden>Close</VisuallyHidden>
                            <span aria-hidden>×</span>
                          </CloseButton>
                          <SignaturePad
                            ref={sigCanvas}
                            onBegin={() =>
                              setFieldTouched('signature', true, true)
                            }
                            canvasProps={{
                              className: 'signatureCanvas',
                            }}
                          />
                          <ButtonGroup spacing={4}>
                            <Button
                              variantColor="gray"
                              variant="outline"
                              size="lg"
                              mt="8"
                              onClick={clear}>
                              <Trans id="clear" />
                            </Button>
                            <Button
                              variantColor="brand"
                              size="lg"
                              mt="8"
                              onClick={() => {
                                setFieldValue(
                                  'signature',
                                  sigCanvas.current
                                    .getTrimmedCanvas()
                                    .toDataURL('image/png')
                                )
                                close()
                              }}>
                              <Trans id="saveSignature" />
                            </Button>
                          </ButtonGroup>
                        </DialogContent>
                      </DialogOverlay>
                      {values.signature ? (
                        <img
                          src={values.signature}
                          alt="my signature"
                          style={{
                            display: 'block',
                            marginTop: '18px',
                            width: '300px',
                          }}
                        />
                      ) : null}

                      <FormErrorMessage>
                        {form.errors.signature}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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
              <Persist name="declaration" />
            </Form>
          )
        }}
      </Formik>
    </Flex>
  )
}
