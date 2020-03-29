import React, { useContext } from 'react'
import { Trans } from '../locale/Trans'
import { Flex, Box, Text } from '@chakra-ui/core'
import { LanguageContext } from '../locale/LanguageContext'
import { RadioButtonGroup, Button } from '@chakra-ui/core'
export function LanguageSelector() {
  const languageContext = useContext(LanguageContext)
  return (
    <Flex flexDirection="column" alignItems="center">
      <Box w="100%" justifyContent="center" mt="8" mb="16" d="flex">
        <Text
          fontWeight="semibold"
          color={languageContext.language === 'ro' ? 'brand.800' : 'gray.700'}
          onClick={() => languageContext.setLanguage('ro')}>
          RO
        </Text>{' '}
        |{' '}
        <Text
          fontWeight="semibold"
          color={languageContext.language === 'en' ? 'brand.800' : 'gray.700'}
          onClick={() => languageContext.setLanguage('en')}>
          EN
        </Text>
      </Box>
      <Trans id="langSelect" />
      <RadioButtonGroup
        mt="4"
        mb="16"
        d="flex"
        flexDirection="column"
        justifyContent="center"
        defaultValue={languageContext.language}
        onChange={val => languageContext.setLanguage(val)}>
        <CustomRadio value="ro">
          <Trans id="ro" />
        </CustomRadio>
        <CustomRadio value="en">
          <Trans id="en" />
        </CustomRadio>
      </RadioButtonGroup>
    </Flex>
  )
}
const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, isDisabled, value, ...rest } = props
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'brand' : 'brand'}
      aria-checked={isChecked}
      role="radio"
      size="lg"
      minW="300px"
      isDisabled={isDisabled}
      {...rest}
    />
  )
})
