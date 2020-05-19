import React, { useState, useContext, useRef } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import ro from 'date-fns/locale/ro'
import format from 'date-fns/format'
import ReactSelect from 'react-select'
import SignaturePad from 'react-signature-canvas'
import fetcher from '../utils/fetcher'
import useSWR from 'swr'
import {
  Heading,
  Box,
  Checkbox,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  CloseButton,
  VisuallyHidden,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  RadioButtonGroup,
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
import '../assets/css/datepicker.css'
import { groupedCountries } from '../assets/data/groupedCountries'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { CustomRadio } from '../components/CustomRadio'
import { LanguageContext } from '../locale/LanguageContext'
const api = process.env.REACT_APP_API

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
const customStyles = {
  control: (styles, state) => ({
    ...styles,
    'backgroundColor': 'white',
    'border': 'none',
    'borderRadius': 0,
    'height': '2.5rem',
    'boxShadow': 'none',
    'borderBottom': state.isFocused ? 'solid 2px #3182ce' : 'solid 2px #e7ebed',
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
const formatGroupLabel = (data) => (
  <Flex alignItems="center" justifyContent="space-between">
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </Flex>
)

export function Declaration() {
  let history = useHistory()
  const toast = useToast()
  const sigCanvas = useRef({})
  const [disabled, setDisabled] = useState(false)

  function getFormattedPhone(phone) {
    if (!phone) {
      history.push('/introducere-telefon')
    } else {
      const phoneJson = JSON.parse(phone)
      const phoneWithoutZero =
        phoneJson.phone.substring(0, 1) === '0'
          ? phoneJson.phone.substring(1, phoneJson.phone.length)
          : phoneJson.phone
      return `${phoneJson.phone_country_prefix}${phoneWithoutZero}`
    }
  }
  const initialValues = {
    surname: '',
    phone: getFormattedPhone(localStorage.getItem('phone')),
    name: '',
    cnp: '',
    email: '',
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
    },
    vehicle_type: 'auto',
    vehicle_registration_no: '',
    signature: '',
    accept_personal_data: false,
    accept_read_law: false,
  }
  const judete = useSWR('/data/judete.json', fetcher, {
    revalidateOnFocus: false,
  })
  const declarationCode =
    JSON.parse(localStorage.getItem('declaration_code')) || []
  const token = localStorage.getItem('token')
  const counties =
    judete.data &&
    judete.data.judete.map((j) => {
      return {
        value: j.nume,
        label: j.nume,
      }
    })
  const citiesByCounty = (county) => {
    if (judete.data && county && county !== '') {
      const citiesArray = judete.data.judete.filter(
        (j) => j.nume === county.value
      )
      const cities = citiesArray[0].localitati
      return cities.map((c) => {
        return { value: c.nume, label: c.nume }
      })
    }
    return []
  }

  const clear = () => sigCanvas.current.clear()
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  const languageContext = useContext(LanguageContext)
  const maxStep = 9
  const [step, setSlide] = useState(1)

  return (
    <>
      {!token || token === '' ? (
        <Redirect to="/introducere-telefon" />
      ) : (
        <Box w="100%">
          <WhiteBox py={1} px={[1, 8]} pos="sticky" top="90px" zIndex="sticky">
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
                {step}/{maxStep}
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
              if (!values.travelling_from_city) {
                errors.travelling_from_city =
                  languageContext.dictionary['required']
              }
              if (!values.travelling_from_date) {
                errors.travelling_from_date =
                  languageContext.dictionary['required']
              }
              if (!values.isolation_addresses.county) {
                errors.county = languageContext.dictionary['required']
              }
              if (!values.isolation_addresses.city) {
                errors.city = languageContext.dictionary['required']
              }
              if (!values.isolation_addresses.city_full_address) {
                errors.city_full_address =
                  languageContext.dictionary['required']
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
              if (values.accept_personal_data === false) {
                errors.accept_personal_data =
                  languageContext.dictionary['required']
              }
              if (values.accept_read_law === false) {
                errors.accept_read_law = languageContext.dictionary['required']
              }
              return errors
            }}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              const payload = {
                ...values,
                travelling_from_country_code:
                  values.travelling_from_country_code.value,
                travelling_from_date: format(
                  values.travelling_from_date,
                  'yyyy-MM-dd'
                ),
                isolation_addresses: [
                  {
                    ...values.isolation_addresses,
                    city: values.isolation_addresses.city.value,
                    county: values.isolation_addresses.county.value,
                  },
                ],
              }

              try {
                const request = await fetch(`${api}/declaration`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-API-KEY': process.env.REACT_APP_API_KEY,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(payload),
                })
                const response = await request.json()
                if (response.status === 'success') {
                  resetForm({
                    values: initialValues,
                    touched: {},
                    errors: {},
                    dirty: false,
                  })
                  localStorage.removeItem('phone')
                  localStorage.removeItem('token')
                  localStorage.setItem(
                    'declaration_code',
                    JSON.stringify([
                      ...declarationCode,
                      response.declaration_code,
                    ])
                  )
                  toast({
                    title: <Trans id="success" />,
                    description: <Trans id="declarationSuccess" />,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
                  setTimeout(() => {
                    setDisabled(true)
                    history.push('/success')
                  }, 3000)
                } else {
                  let message
                  switch (response.message) {
                    case 'Invalid value for parameter: cnp':
                      message = languageContext.dictionary['incorrectCNP']
                      break
                    case 'Invalid value for parameter: document_series':
                      message = languageContext.dictionary['incorrectSerie']
                      break
                    case 'Invalid value for parameter: document_number':
                      message = languageContext.dictionary['incorrectNumber']
                      break
                    case 'Invalid value for parameter: travelling_from_date':
                      message = languageContext.dictionary['incorrectDate']
                      break
                    case 'Unauthorized':
                      message = languageContext.dictionary['unauthorized']
                      break
                    default:
                      message = languageContext.dictionary['unknownError']
                  }
                  setDisabled(false)
                  toast({
                    title: <Trans id="error" />,
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
                  title: <Trans id="error" />,
                  description: error.message,
                  status: 'error',
                  isClosable: true,
                  duration: null,
                })
              }
            }}>
            {({
              values,
              errors,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
              isSubmitting,
            }) => {
              return (
                <Form>
                  {/* Step 1 - name, surname, CNP */}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(1)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form1Label" />
                    </Heading>
                    <Field name="surname">
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.surname && form.touched.surname
                          }>
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
                          <FormErrorMessage>
                            {form.errors.surname}
                          </FormErrorMessage>
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
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
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
                  {/* Step 2 - pasaport/buletin serie numar*/}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(2)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form2Label" />
                    </Heading>
                    <RadioButtonGroup
                      defaultValue="passport"
                      name="document_type"
                      d="grid"
                      my="8"
                      gridTemplateColumns="1fr 1fr"
                      gridGap="1rem"
                      w="100%"
                      isInline
                      justifyContent="space-between"
                      onChange={(val) => setFieldValue('document_type', val)}>
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
                  {/* Step 3 - travelling from*/}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(3)}>
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
                          <FormLabel
                            htmlFor="travelling_from_country_code"
                            mt="8">
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
                            <DatePicker
                              selected={form.values.travelling_from_date}
                              locale={ro}
                              name="travelling_from_date"
                              isRequired
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) =>
                                setFieldValue('travelling_from_date', date)
                              }
                              placeholderText={
                                languageContext.dictionary['selectDate']
                              }
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
                  </WhiteBox>
                  {/* Step 4 - isolation address*/}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(4)}>
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
                          <FormLabel
                            htmlFor="isolation_addresses.county"
                            mt="8">
                            <Trans id="judet" />
                          </FormLabel>
                          <ReactSelect
                            {...field}
                            placeholder={
                              languageContext.dictionary['selectCounty']
                            }
                            variant="flushed"
                            isRequired
                            isClearable={true}
                            options={
                              !judete.error
                                ? counties
                                : [
                                    {
                                      value: 0,
                                      label: <Trans id="errorData" />,
                                    },
                                  ]
                            }
                            isLoading={!judete.data}
                            onChange={(val) =>
                              setFieldValue('isolation_addresses.county', val)
                            }
                            onBlur={() =>
                              setFieldTouched(
                                'isolation_addresses.county',
                                true,
                                true
                              )
                            }
                            mt="4"
                            styles={customStyles}
                          />
                          <FormErrorMessage>
                            {form.errors.county}
                          </FormErrorMessage>
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
                          <ReactSelect
                            {...field}
                            placeholder={
                              languageContext.dictionary['placeholderCity']
                            }
                            variant="flushed"
                            isRequired
                            isClearable={true}
                            options={
                              !judete.error
                                ? citiesByCounty(
                                    values.isolation_addresses.county
                                  )
                                : [
                                    {
                                      value: 0,
                                      label: <Trans id="errorData" />,
                                    },
                                  ]
                            }
                            isLoading={!judete.data}
                            onChange={(val) =>
                              setFieldValue('isolation_addresses.city', val)
                            }
                            onBlur={() =>
                              setFieldTouched(
                                'isolation_addresses.city',
                                true,
                                true
                              )
                            }
                            mt="4"
                            styles={customStyles}
                          />
                          <FormErrorMessage>
                            {form.errors.city}
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
                  {/* Step 5 - phone email*/}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(5)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form5Label" />
                    </Heading>
                    <Field name="phone">
                      {({ field, form }) => (
                        <FormControl isRequired>
                          <FormLabel htmlFor="phone" mt="4">
                            <Trans id="telefon" />
                          </FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              name="phone"
                              isDisabled
                              variant="flushed"
                            />
                            <InputRightElement
                              children={
                                !form.errors.phone && (
                                  <Icon name="check" color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl
                          isRequired
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
                            {form.errors.email}
                          </FormErrorMessage>
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
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(6)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form9Label" />
                    </Heading>
                    <RadioButtonGroup
                      value={values.vehicle_type}
                      name="vehicle_type"
                      d="grid"
                      mt="8"
                      gridTemplateColumns="1fr 1fr"
                      gridGap="1rem"
                      w="100%"
                      isInline
                      justifyContent="space-between"
                      onChange={(val) => setFieldValue('vehicle_type', val)}>
                      >
                      <CustomRadio value="auto">
                        <Trans id="auto" />
                      </CustomRadio>
                      <CustomRadio value="ambulance">
                        <Trans id="ambulance" />
                      </CustomRadio>
                    </RadioButtonGroup>
                  </WhiteBox>
                  {/* Step 7 */}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(7)}>
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
                                languageContext.dictionary[
                                  'placeholderAutomobil'
                                ]
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
                  {/* Step 8 */}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(8)}>
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
                            {!form.errors.signature &&
                              form.touched.signature && (
                                <Icon name="check" color="green.500" ml="4" />
                              )}
                          </Button>
                          <DialogOverlay
                            isOpen={showDialog}
                            onDismiss={close}
                            style={{ zIndex: 1400 }}>
                            <DialogContent
                              aria-label="signature"
                              style={{
                                border: 'solid 2px #3585cf',
                                borderRadius: '8px',
                                position: 'relative',
                                minWidth: 370,
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
                  {/* Step 9 */}
                  <WhiteBox p={[1, 8]} onClick={() => setSlide(9)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="acceptanceTitle" />
                    </Heading>
                    <Heading size="sm" lineHeight="32px" fontWeight="600">
                      <Trans id="acceptanceLabel" />
                    </Heading>
                    <Field name="accept_personal_data">
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.accept_personal_data &&
                            form.touched.accept_personal_data
                          }>
                          <Checkbox
                            {...field}
                            size="lg"
                            variantColor="brand"
                            mt={4}>
                            <Trans id="acceptPersonalData" />
                          </Checkbox>
                          <FormErrorMessage>
                            {form.errors.accept_personal_data}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="accept_read_law">
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.accept_read_law &&
                            form.touched.accept_read_law
                          }>
                          <Checkbox
                            {...field}
                            size="lg"
                            variantColor="brand"
                            mt={6}>
                            <Trans id="acceptReadLaw" />
                          </Checkbox>
                          <FormErrorMessage>
                            {form.errors.accept_read_law}
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
                      disabled={disabled}
                      isLoading={isSubmitting}
                      onClick={handleSubmit}
                      type="submit">
                      <Trans id="trimite" />
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </Box>
      )}
    </>
  )
}
