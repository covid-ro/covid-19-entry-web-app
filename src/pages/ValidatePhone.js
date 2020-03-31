import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, Link as RLink } from 'react-router-dom'
import {
  Heading,
  Box,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Text,
  Link,
  Button,
  Progress,
  Flex,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { useState } from 'react'

export function ValidatePhone() {
  let history = useHistory()
  const { handleSubmit, errors, register, formState } = useForm()
  function validateCode(value) {
    let error
    if (!value) {
      error = 'Cod obligatoriu'
    } else if (value.length !== 6) {
      error = 'Codul contine 6 cifre'
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
    history.push('/declaratie')
  }
  const [seconds, decrement] = useState(30)
  const [progress, increment] = useState(0)
  useEffect(() => {
    if (seconds > 0) {
      const progressLevel = setInterval(() => {
        increment(progress + 3.3333333)
        decrement(seconds - 1)
      }, 1000)
      return () => clearInterval(progressLevel)
    }
  }, [progress, seconds])
  return (
    <Flex flexDirection="column" w="100%">
      <WhiteBox>
        <Flex flexDirection="row" width="100%" alignItems="center">
          <Progress value={progress} height="2px" w="90%" grow={1} />
          <Text ml="auto">00:{seconds < 10 ? `0${seconds}` : seconds}</Text>
        </Flex>
      </WhiteBox>
      <WhiteBox>
        <Heading size="md" lineHeight="32px" fontWeight="400">
          <Trans id="addSMSCode" />
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.phone}>
            <FormLabel htmlFor="phone_validation_code" mt="20">
              <Trans id="codValidareSMS" />
            </FormLabel>

            <Input
              name="phone_validation_code"
              defaultValue="666666"
              variant="flushed"
              placeholder="723000000"
              ref={register({ validate: validateCode })}
            />

            <FormErrorMessage>
              {errors.phone_validation_code &&
                errors.phone_validation_code.message}
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
              disabled={seconds === 0}
              isLoading={formState.isSubmitting}
              type="submit">
              <Trans id="save" />
            </Button>
            <Text pt="4">
              <Trans id="dontReceiveTheCode" />
            </Text>
            <Link as={RLink} to="/introducere-telefon" pt="2" color="brand.800">
              <Trans id="resendSMSCod" />
            </Link>
          </Box>
        </form>
      </WhiteBox>
    </Flex>
  )
}
