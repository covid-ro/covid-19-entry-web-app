import React, { useContext } from 'react'
import { languageOptions } from '../locale/languages'

import { LanguageContext } from '../locale/LanguageContext'
import { RadioButtonGroup, Button } from '@chakra-ui/core'
export function LanguageSelector() {
  const languageContext = useContext(LanguageContext)
  return (
    <RadioButtonGroup
      defaultValue={languageContext.language}
      onChange={val => languageContext.setLanguage(val)}
      isInline>
      {languageOptions.map(item => (
        <CustomRadio key={item.id} value={item.id}>
          {item.text}
        </CustomRadio>
      ))}
    </RadioButtonGroup>
  )
}
const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, isDisabled, value, ...rest } = props
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'red' : 'gray'}
      aria-checked={isChecked}
      role="radio"
      isDisabled={isDisabled}
      {...rest}
    />
  )
})
