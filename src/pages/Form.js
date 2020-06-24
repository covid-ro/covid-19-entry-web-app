import React, { useState, useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'
import { DatePicker } from '../components/DatePicker'
// import { Spinner } from '../components/Spinner'
import { Spinner } from '@chakra-ui/core'
import 'react-datepicker/dist/react-datepicker.css'
// import { DialogOverlay, DialogContent } from '@reach/dialog'
import format from 'date-fns/format'
import { omit } from 'ramda'
import ReactSelect from 'react-select'
// import SignaturePad from 'react-signature-canvas'
import fetcher from '../utils/fetcher'
import useSWR from 'swr'
import { CheckIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Heading,
  Box,
  useColorMode,
  Checkbox,
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  // CloseButton,
  // VisuallyHidden,
  Switch,
  Input,
  InputGroup,
  InputRightElement,
  // RadioButtonGroup,
  Slider,
  Button,
  Flex,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  // ButtonGroup,
} from '@chakra-ui/core'

import '@reach/dialog/styles.css'
import '../assets/css/datepicker.css'
import { groupedCountries } from '../assets/data/groupedCountries'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
// import { CustomRadio } from '../components/CustomRadio'
import { LanguageContext } from '../locale/LanguageContext'
import { Layout } from '../components/Layout'
const api = process.env.REACT_APP_API

function Declaration() {
  let history = useHistory()
  const toast = useToast()
  // const sigCanvas = useRef({})
  const [disabled, setDisabled] = useState(false)
  // const clear = () => sigCanvas.current.clear()
  // const [showDialog, setShowDialog] = useState(false)
  const [countyId, setCountyId] = useState('')
  const [colorMode] = useColorMode()
  const bgColor = { light: '#fff', dark: '#171923' }
  const color = { light: '#171923', dark: '#fff' }
  const borderColor = { light: '#e7ebed', dark: '#4a4a4a' }
  const optionColor = {
    light: { selected: '#2653B0', regular: '#4a4a4a' },
    dark: { selected: '#ffffff', regular: '#e7ebed' },
  }
  const optionHover = {
    light: { focused: '#a8bfda', regular: '#ffffff' },
    dark: { focused: '#171923', regular: '#4a4a4a' },
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
  const customStyles = {
    control: (styles, state) => ({
      ...styles,
      'backgroundColor': 'transparent',
      'border': 'none',
      'borderRadius': 0,
      'height': '2.5rem',
      'boxShadow': 'none',
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
      color: color[colorMode],
    }),
    container: (styles, state) => ({
      ...styles,
      width: '100%',
    }),
    menu: (styles) => ({
      ...styles,
      width: '100%',
      borderColor: borderColor[colorMode],
      borderWidth: '1px',
      backgroundColor: bgColor[colorMode],
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected
        ? optionColor[colorMode].selected
        : optionColor[colorMode].regular,
      backgroundColor: state.isFocused
        ? optionHover[colorMode].focused
        : optionHover[colorMode].regular,
    }),
  }
  const formatGroupLabel = (data) => (
    <Flex alignItems="center" justifyContent="space-between">
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </Flex>
  )
  // const open = () => setShowDialog(true)
  // const close = () => setShowDialog(false)
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
    is_romanian: true,
    birth_date: '',
    // email: '',
    // document_type: 'passport',
    // document_series: '',
    // document_number: '',
    travelling_from_country_code: '',
    // travelling_from_city: '',
    // travelling_from_date: '',
    // itinerary_countries: [],
    // travel_route: '',
    home_isolated: false,
    isolation_addresses: {
      settlement_id: '',
      county_id: '',
      street: '',
      number: '',
      bloc: '',
      entry: '',
      apartment: '',
    },
    // vehicle_type: 'auto',
    // vehicle_registration_no: '',
    // signature: '',
    accept_personal_data: false,
    accept_read_law: false,
  }
  const counties = useSWR(`${api}/address/county`, fetcher, {
    revalidateOnFocus: false,
  })
  const settlements = useSWR(
    () => (countyId ? `${api}/address/settlement/${countyId}` : null),
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const declarationCode =
    JSON.parse(localStorage.getItem('declaration_code')) || []
  const token = localStorage.getItem('token')

  const languageContext = useContext(LanguageContext)
  const maxStep = 5
  const [step, setSlide] = useState(1)
  return (
    <Layout title="Declarație">
      {!token || token === '' ? (
        <Redirect to="/introducere-telefon" />
      ) : !counties.data ? (
        <Spinner
          thickness="2px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="sm"
        />
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
            validateOnChange={false}
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
              if (!values.is_romanian) {
                if (values.birth_date === '') {
                  errors.birth_date = languageContext.dictionary['required']
                }
              }
              // if (!values.document_number) {
              //   errors.document_number = languageContext.dictionary['required']
              // }
              // if (
              //   values.document_series &&
              //   !/^[a-z]+$/i.test(values.document_series)
              // ) {
              //   errors.document_series =
              //     languageContext.dictionary['incorrectSerie']
              // }
              if (!values.travelling_from_country_code) {
                errors.travelling_from_country_code =
                  languageContext.dictionary['required']
              }
              // if (!values.travelling_from_city) {
              //   errors.travelling_from_city =
              //     languageContext.dictionary['required']
              // }
              // if (!values.travelling_from_date) {
              //   errors.travelling_from_date =
              //     languageContext.dictionary['required']
              // }
              if (
                values.cnp.lastIndexOf('7', 0) === 0 ||
                values.cnp.lastIndexOf('8', 0) === 0 ||
                !values.home_isolated
              ) {
                if (!values.isolation_addresses.county_id) {
                  errors.county_id = languageContext.dictionary['required']
                }
                if (!values.isolation_addresses.settlement_id) {
                  errors.settlement_id = languageContext.dictionary['required']
                }
              }

              // if (
              //   values.email !== '' &&
              //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              // ) {
              //   errors.email = languageContext.dictionary['invalidEmail']
              // }
              // if (values.signature === '') {
              //   errors.signature = languageContext.dictionary['required']
              // }
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
                isolation_addresses: [
                  {
                    ...values.isolation_addresses,
                    settlement_id: values.isolation_addresses.settlement_id.id,
                    county_id: values.isolation_addresses.county_id.id,
                  },
                ],
                birth_date:
                  values.birth_date !== '' &&
                  format(values.birth_date, 'yyyy-MM-dd'),
                // itinerary_countries: values.itinerary_countries.map(
                //   (c) => c.value
                // ),
              }
              const body = !!values.is_romanian
                ? omit(['birth_date'], payload)
                : payload
              try {
                const request = await fetch(`${api}/declaration`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-API-KEY': process.env.REACT_APP_API_KEY,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body),
                })
                const response = await request.json()
                if (response.status === 'success') {
                  resetForm({
                    values: initialValues,
                    touched: {},
                    errors: {},
                    dirty: false,
                  })
                  localStorage.setItem(
                    'declaration_code',
                    JSON.stringify([
                      ...declarationCode,
                      {
                        code: response.declaration.code,
                        name: response.declaration.name,
                        surname: response.declaration.surname,
                        cnp: response.declaration.cnp,
                      },
                    ])
                  )
                  toast({
                    title: languageContext.dictionary['success'],
                    description:
                      languageContext.dictionary['declarationSuccess'],
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
                  setDisabled(true)
                  setTimeout(() => {
                    history.push('/succes')
                  }, 3000)
                } else {
                  let message
                  switch (response.message) {
                    case 'Invalid value for parameter: cnp':
                      message = languageContext.dictionary['incorrectCNP']
                      break
                    case 'Invalid value for parameter: birth_date':
                      message = languageContext.dictionary['incorrectBday']
                      break
                    case 'incorrect identity match':
                      message = languageContext.dictionary['incorrectName']
                      break
                    // case 'Invalid value for parameter: document_series':
                    //   message = languageContext.dictionary['incorrectSerie']
                    //   break
                    // case 'Invalid value for parameter: document_number':
                    //   message = languageContext.dictionary['incorrectNumber']
                    //   break
                    // case 'Invalid value for parameter: travelling_from_date':
                    //   message = languageContext.dictionary['incorrectDate']
                    //   break
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
            {({
              values,
              errors,
              setFieldValue,
              setErrors,
              setFieldTouched,
              isSubmitting,
            }) => {
              return (
                <Form>
                  {/* Step 1 - name, surname, CNP */}
                  <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(1)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form1Label" />
                    </Heading>
                    <Field name="name">
                      {({ field, form }) => (
                        <FormControl
                          d="flex"
                          alignItems="center"
                          w="100%"
                          mt="8">
                          <FormLabel htmlFor="nationality">
                            <Trans id="form1Switch" />
                          </FormLabel>
                          <Switch
                            {...field}
                            isChecked={values.is_romanian}
                            name="is_romanian"
                            id="nationality"
                            size="lg"
                            colorScheme="brand"
                            ml="auto"
                          />
                        </FormControl>
                      )}
                    </Field>
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
                              placeholder={
                                languageContext.dictionary['namePlaceholder']
                              }
                            />
                            <InputRightElement
                              children={
                                !form.errors.surname &&
                                form.touched.surname && (
                                  <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            <WarningIcon color="red.500" marginRight="2" />
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
                              placeholder={
                                languageContext.dictionary['surnamePlaceholder']
                              }
                            />
                            <InputRightElement
                              children={
                                !form.errors.name &&
                                form.touched.name && (
                                  <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            <WarningIcon color="red.500" marginRight="2" />
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
                            {values.is_romanian ? 'CNP' : <Trans id="cnp" />}
                          </FormLabel>
                          <InputGroup>
                            <Input
                              name="cnp"
                              {...field}
                              variant="flushed"
                              placeholder={
                                languageContext.dictionary['cnpPlaceholder']
                              }
                            />
                            <InputRightElement
                              children={
                                !form.errors.cnp &&
                                form.touched.cnp && (
                                  <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            <WarningIcon color="red.500" marginRight="2" />
                            {form.errors.cnp}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    {!values.is_romanian && (
                      <Field name="birth_date">
                        {({ field, form }) => (
                          <FormControl
                            isRequired={true}
                            isInvalid={
                              form.errors.birth_date && form.touched.birth_date
                            }>
                            <FormLabel htmlFor="birth_date" mt="4">
                              <Trans id="birthdate" />
                            </FormLabel>
                            <InputGroup>
                              <DatePicker
                                {...field}
                                selected={form.values.birth_date}
                                name="birth_date"
                                showMonthDropdown
                                showYearDropdown
                                locale={languageContext.language}
                                dropdownMode="select"
                                onChangeDate={setFieldValue}
                                onDateLeave={setFieldTouched}
                                placeholder={
                                  languageContext.dictionary['selectDate']
                                }
                                className={colorMode === 'dark' ? 'dark' : ''}
                              />
                              <InputRightElement
                                children={
                                  !form.errors.birth_date &&
                                  form.touched.birth_date && (
                                    <CheckIcon color="green.500" />
                                  )
                                }
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.birth_date}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}
                  </WhiteBox>
                  {/* Step 2 - pasaport/buletin serie numar*/}
                  {/* <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(2)}>
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
                                onChange={(e) =>
                                  setFieldValue(
                                    'document_series',
                                    e.target.value.toUpperCase()
                                  )
                                }
                                name="document_series"
                                variant="flushed"
                                isRequired
                                placeholder={
                                  languageContext.dictionary[
                                    'seriesPlaceholder'
                                  ]
                                }
                              />
                              <InputRightElement
                                children={
                                  !form.errors.document_series &&
                                  form.touched.document_series && (
                                     <CheckIcon color="green.500" />
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
                              placeholder={
                                languageContext.dictionary['numberPlaceholder']
                              }
                            />
                            <InputRightElement
                              children={
                                !form.errors.document_number &&
                                form.touched.document_number && (
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{errors.document_number}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </WhiteBox>
                   */}
                  {/* Step 3 - travelling from*/}
                  <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(2)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="form3LabelTemp" />
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
                            onChange={(val) => {
                              setFieldValue('travelling_from_country_code', val)
                              setErrors(
                                'travelling_from_country_code',
                                undefined
                              )
                            }}
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
                            <WarningIcon color="red.500" marginRight="2" />
                            {form.errors.travelling_from_country_code}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    {/* <Field name="travelling_from_city">
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
                              placeholder={
                                languageContext.dictionary['cityPlaceholder']
                              }
                            />
                            <InputRightElement
                              children={
                                !form.errors.travelling_from_city &&
                                form.touched.travelling_from_city && (
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{errors.travelling_from_city}
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
                              locale={values.is_romanian ? ro : null}
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
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.travelling_from_date}
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
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.itinerary_countries}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Heading
                      size="md"
                      mt="8"
                      lineHeight="32px"
                      fontWeight="400">
                      <Trans id="form10Title" />
                    </Heading>
                    <Field name="travel_route">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.travel_route &&
                            form.touched.travel_route
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
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.travel_route}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                   */}
                  </WhiteBox>
                  {/* Step 4 - isolation address*/}
                  <WhiteBox
                    p={[1, 8]}
                    justifyContent="space-between"
                    d="inline-flex"
                    flexWrap="wrap"
                    onClick={() => setSlide(3)}>
                    <Heading
                      size="md"
                      lineHeight="32px"
                      fontWeight="400"
                      w="100%">
                      <Trans id="form4Label" />
                    </Heading>
                    {!(
                      values.cnp.lastIndexOf('7', 0) === 0 ||
                      values.cnp.lastIndexOf('8', 0) === 0 ||
                      !values.is_romanian
                    ) && (
                      <Field name="home_isolated">
                        {({ field, form }) => (
                          <FormControl
                            d="flex"
                            alignItems="center"
                            w="100%"
                            mt="8"
                            isInvalid={
                              form.errors.home_isolated &&
                              form.touched.home_isolated
                            }>
                            <FormLabel htmlFor="home_isolated">
                              <Trans id="form4Switch" />
                            </FormLabel>
                            <Switch
                              {...field}
                              isChecked={values.home_isolated}
                              id="home_isolated"
                              size="lg"
                              color="brand"
                              name="home_isolated"
                              ml="auto"
                            />
                            <FormErrorMessage>
                              {form.errors.home_isolated}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}
                    {!values.home_isolated && (
                      <>
                        <Field name="isolation_addresses.county_id">
                          {({ field, form }) => (
                            <FormControl
                              w="100%"
                              isInvalid={
                                form.touched?.isolation_addresses?.county_id &&
                                form.errors.county_id
                              }>
                              <FormLabel
                                htmlFor="isolation_addresses.county_id"
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
                                  !counties.error
                                    ? counties.data.data
                                    : [
                                        {
                                          value: 0,
                                          label: <Trans id="errorData" />,
                                        },
                                      ]
                                }
                                getOptionValue={(option) => `${option.id}`}
                                getOptionLabel={(option) => `${option.name}`}
                                isLoading={!counties.data}
                                onChange={(val) => {
                                  if (val !== null) {
                                    setCountyId(val.id)
                                    setFieldValue(
                                      'isolation_addresses.county_id',
                                      val
                                    )
                                    setFieldValue(
                                      'isolation_addresses.settlement_id',
                                      ''
                                    )
                                    setErrors('county_id', undefined)
                                  } else {
                                    setFieldValue(
                                      'isolation_addresses.county_id',
                                      ''
                                    )
                                    setFieldValue(
                                      'isolation_addresses.settlement_id',
                                      ''
                                    )
                                  }
                                }}
                                onBlur={() =>
                                  setFieldTouched(
                                    'isolation_addresses.county_id',
                                    true,
                                    true
                                  )
                                }
                                mt="4"
                                styles={customStyles}
                              />
                              <FormErrorMessage>
                                {form.errors.county_id}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.settlement_id">
                          {({ field, form }) => (
                            <FormControl
                              w="100%"
                              isInvalid={
                                form.errors.settlement_id &&
                                form.touched?.isolation_addresses?.settlement_id
                              }>
                              <FormLabel
                                htmlFor="isolation_addresses.settlement_id"
                                mt="4">
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
                                  !settlements.data
                                    ? [
                                        {
                                          value: 0,
                                          label: <Trans id="errorData" />,
                                        },
                                      ]
                                    : settlements.data.data
                                }
                                getOptionValue={(option) => `${option.id}`}
                                getOptionLabel={(option) => `${option.name}`}
                                isLoading={!counties.data}
                                onChange={(val) => {
                                  setFieldValue(
                                    'isolation_addresses.settlement_id',
                                    val
                                  )
                                  setErrors('settlement_id', undefined)
                                }}
                                onBlur={() =>
                                  setFieldTouched(
                                    'isolation_addresses.settlement_id',
                                    true,
                                    true
                                  )
                                }
                                mt="4"
                                styles={customStyles}
                              />
                              <FormErrorMessage>
                                {form.errors.settlement_id}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.street">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.street &&
                                form.touched?.isolation_addresses?.street
                              }
                              w="77%">
                              <FormLabel
                                htmlFor="isolation_addresses.street"
                                mt="4">
                                <Trans id="adresaStreet" />
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  name="isolation_addresses.street"
                                  variant="flushed"
                                  placeholder={
                                    languageContext.dictionary[
                                      'streetPlaceholder'
                                    ]
                                  }
                                />
                                <InputRightElement
                                  children={
                                    !form.errors.street &&
                                    form.touched?.isolation_addresses
                                      ?.street && (
                                      <CheckIcon color="green.500" />
                                    )
                                  }
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.street}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.number">
                          {({ field, form }) => (
                            <FormControl
                              isInvalid={
                                form.errors.number &&
                                form.touched?.isolation_addresses?.number
                              }
                              w="20%">
                              <FormLabel
                                htmlFor="isolation_addresses.number"
                                mt="4">
                                <Trans id="adresaNumber" />
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  name="isolation_addresses.number"
                                  variant="flushed"
                                />
                                <InputRightElement
                                  children={
                                    !form.errors.number &&
                                    form.touched?.isolation_addresses
                                      ?.number && (
                                      <CheckIcon color="green.500" />
                                    )
                                  }
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.number}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.bloc">
                          {({ field, form }) => (
                            <FormControl
                              w="31%"
                              isInvalid={
                                form.errors.bloc &&
                                form.touched?.isolation_addresses?.bloc
                              }>
                              <FormLabel
                                htmlFor="isolation_addresses.bloc"
                                mt="4">
                                <Trans id="adresaBloc" />
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  name="isolation_addresses.bloc"
                                  variant="flushed"
                                />
                                <InputRightElement
                                  children={
                                    !form.errors.bloc &&
                                    form.touched?.isolation_addresses?.bloc && (
                                      <CheckIcon color="green.500" />
                                    )
                                  }
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.bloc}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.entry">
                          {({ field, form }) => (
                            <FormControl
                              w="31%"
                              isInvalid={
                                form.errors.entry &&
                                form.touched?.isolation_addresses?.entry
                              }>
                              <FormLabel
                                htmlFor="isolation_addresses.entry"
                                mt="4">
                                <Trans id="adresaEntry" />
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  name="isolation_addresses.entry"
                                  variant="flushed"
                                />
                                <InputRightElement
                                  children={
                                    !form.errors.entry &&
                                    form.touched?.isolation_addresses
                                      ?.entry && <CheckIcon color="green.500" />
                                  }
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.entry}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="isolation_addresses.apartment">
                          {({ field, form }) => (
                            <FormControl
                              w="31%"
                              isInvalid={
                                form.errors.apartment &&
                                form.touched?.isolation_addresses?.apartment
                              }>
                              <FormLabel
                                htmlFor="isolation_addresses.apartment"
                                mt="4">
                                <Trans id="adresaApartment" />
                              </FormLabel>
                              <InputGroup>
                                <Input
                                  {...field}
                                  name="isolation_addresses.apartment"
                                  variant="flushed"
                                />
                                <InputRightElement
                                  children={
                                    !form.errors.apartment &&
                                    form.touched?.isolation_addresses
                                      ?.apartment && (
                                      <CheckIcon color="green.500" />
                                    )
                                  }
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {form.errors.apartment}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </>
                    )}
                  </WhiteBox>
                  {/* Step 5 - phone email*/}
                  <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(4)}>
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
                                  <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    {/* <Field name="email">
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
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                     */}
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
                  {/* <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(6)}>
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
                   */}
                  {/* Step 7 */}
                  {/* <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(7)}>
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
                                   <CheckIcon color="green.500" />
                                )
                              }
                            />
                          </InputGroup>
                           <FormErrorMessage>
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.vehicle_registration_no}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </WhiteBox> */}
                  {/* Step 9 */}
                  {/* <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(5)}>
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
                            colorScheme="brand"
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
                                  colorScheme="gray"
                                  variant="outline"
                                  size="lg"
                                  mt="8"
                                  onClick={clear}>
                                  <Trans id="clear" />
                                </Button>
                                <Button
                                  colorScheme="brand"
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
                          <WarningIcon color="red.500" marginRight="2" />{form.errors.signature}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </WhiteBox> */}
                  {/* Step 10 */}
                  <WhiteBox p={[2, 8, 8, 8]} onClick={() => setSlide(5)}>
                    <Heading size="md" lineHeight="32px" fontWeight="400">
                      <Trans id="acceptanceTitle" />
                    </Heading>

                    <Field name="accept_personal_data">
                      {({ field, form }) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            form.errors.accept_personal_data &&
                            form.touched.accept_personal_data
                          }>
                          <FormLabel htmlFor="accept_personal_data" mt="4">
                            <Trans id="acceptanceLabel" />
                          </FormLabel>
                          <Checkbox
                            {...field}
                            size="lg"
                            borderColor="brand.500"
                            isInvalid={
                              form.errors.accept_personal_data &&
                              form.touched.accept_personal_data
                            }
                            colorScheme="brand"
                            mt={4}>
                            <Trans id="acceptPersonalData" />
                          </Checkbox>
                          <FormErrorMessage>
                            <WarningIcon color="red.500" marginRight="2" />
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
                            borderColor="brand.500"
                            isInvalid={
                              form.errors.accept_read_law &&
                              form.touched.accept_read_law
                            }
                            colorScheme="brand"
                            mt={6}>
                            <Trans id="acceptReadLaw" />
                          </Checkbox>
                          <FormErrorMessage>
                            <WarningIcon color="red.500" marginRight="2" />
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
                      colorScheme="brand"
                      size="lg"
                      mt="8"
                      w="320px"
                      disabled={disabled}
                      isLoading={isSubmitting}
                      isLo
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
    </Layout>
  )
}
export default Declaration
