import React from 'react'
import { Button } from '@chakra-ui/core'
export const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, isDisabled, value, ...rest } = props
  return (
    <Button
      ref={ref}
      variantColor={isChecked ? 'brand' : 'blue'}
      aria-checked={isChecked}
      role="radio"
      size="lg"
      minW="300px"
      isDisabled={isDisabled}
      {...rest}
    />
  )
})
