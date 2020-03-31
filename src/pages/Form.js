import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from 'react-hook-form-devtools'
import { useHistory } from 'react-router-dom'
import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  RadioButtonGroup,
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

export function Form(props) {
  let history = useHistory()
  const {
    handleSubmit,
    errors,
    watch,
    register,
    formState,
    setValue,
    control,
  } = useForm({ defaultValues: { document_type: 'passport' } })
  const maxStep = 10
  const [step, setSlide] = useState(1)
  function validateName(value) {
    let error
    if (!value) {
      error = 'Prenume obligatoriu'
    }
    return error || true
  }
  function validateSirname(value) {
    let error
    if (!value) {
      error = 'Nume obligatoriu'
    }
    return error || true
  }
  function validateCNP(value) {
    let error
    if (!value) {
      error = 'CNP obligatoriu'
    }
    return error || true
  }

  async function onSubmit(values) {
    console.log('onSubmit -> values', values)
    // return await fetch('/phone/validate', {
    //   method: 'POST',
    //   headers: {
    //     'X-API-KEY': process.env.REACT_APP_API_KEY,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ values }),
    // })
    // history.push('/')
  }
  const documentType = watch('document_type', props.document_type)

  return (
    <Flex flexDirection="column" w="100%">
      <WhiteBox>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1 */}
        <WhiteBox>
          <Heading size="md" lineHeight="32px" fontWeight="400">
            <Trans id="form1Label" />
          </Heading>
          <FormControl isInvalid={errors.sirname}>
            <FormLabel htmlFor="name" mt="8">
              <Trans id="nume" />
            </FormLabel>
            <Input
              name="sirname"
              variant="flushed"
              isRequired
              placeholder="de ex.: Nicolaescu"
              ref={register({ validate: validateSirname })}
            />
            <FormErrorMessage>
              {errors.sirname && errors.sirname.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="name" mt="4">
              <Trans id="prenume" />
            </FormLabel>
            <Input
              name="name"
              variant="flushed"
              isRequired
              placeholder="de ex.: Ion"
              ref={register({ validate: validateName })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.cnp}>
            <FormLabel htmlFor="cnp" mt="4">
              <Trans id="cnp" />
            </FormLabel>
            <Input
              name="cnp"
              variant="flushed"
              isRequired
              placeholder="de ex.: 179....."
              ref={register({ validate: validateCNP })}
            />
            <FormErrorMessage>
              {errors.cnp && errors.cnp.message}
            </FormErrorMessage>
          </FormControl>
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
            onChange={val => setValue('document_type', val)}
            isInline>
            >
            <CustomRadio value="passport" register={register}>
              <Trans id="passport" />
            </CustomRadio>
            <CustomRadio value="identity_card" register={register}>
              <Trans id="card" />
            </CustomRadio>
          </RadioButtonGroup>
          {documentType === 'passport' ? (
            <Heading size="md" lineHeight="32px" fontWeight="400">
              <Trans id="addPassportInfo" />
            </Heading>
          ) : (
            <Heading size="md" lineHeight="32px" fontWeight="400">
              <Trans id="addICInfo" />
            </Heading>
          )}
          <FormControl isInvalid={errors.document_series}>
            <FormLabel htmlFor="document_series" mt="4">
              <Trans id="seria" />
            </FormLabel>
            <Input
              name="document_series"
              variant="flushed"
              isRequired
              placeholder="de ex.: AA"
              ref={register({ required: 'Camp obligatoriu' })}
            />
            <FormErrorMessage>
              {errors.document_series && errors.document_series.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.document_number}>
            <FormLabel htmlFor="document_number" mt="4">
              <Trans id="passportNumber" />
            </FormLabel>
            <Input
              name="document_number"
              variant="flushed"
              isRequired
              placeholder="de ex.: 179....."
              ref={register({ required: 'Camp obligatoriu' })}
            />
            <FormErrorMessage>
              {errors.document_number && errors.document_number.message}
            </FormErrorMessage>
          </FormControl>
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
            isLoading={formState.isSubmitting}
            type="submit">
            <Trans id="validatePhoneNumber" />
          </Button>
        </Box>
      </form>
      <DevTool control={control} />
    </Flex>
  )
}
