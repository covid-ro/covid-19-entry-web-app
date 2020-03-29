import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'

export function SubmitPhone() {
  let history = useHistory()
  const { handleSubmit, errors, register, formState } = useForm()
  function validatePhone(value) {
    let error
    if (!value) {
      error = 'Numar obligatoriu'
    }
    return error || true
  }
  function validatePrefix(value) {
    let error
    if (!value) {
      error = 'Prefix obligatoriu'
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
    history.push('/validare-telefon')
  }

  return (
    <WhiteBox>
      <Heading size="md" lineHeight="32px" fontWeight="400">
        <Trans id="validatePhoneNumberInformationLabel" />
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.phone || errors.phone_country_prefix}>
          <FormLabel htmlFor="phone" mt="20">
            <Trans id="telefon" />
          </FormLabel>
          <InputGroup>
            <InputLeftAddon>
              <Input
                name="phone_country_prefix"
                variant="flushed"
                w="30px"
                placeholder="40"
                defaultValue="43"
                textAlign="right"
                ref={register({ validate: validatePrefix })}
              />
            </InputLeftAddon>
            <Input
              name="phone"
              type="tel"
              roundedLeft="0"
              pl="4"
              defaultValue="6764445906"
              variant="flushed"
              placeholder="723000000"
              ref={register({ validate: validatePhone })}
            />
          </InputGroup>

          <FormErrorMessage>
            {errors.phone && errors.phone.message}
          </FormErrorMessage>
        </FormControl>
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
    </WhiteBox>
  )
}
