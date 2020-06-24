import React from 'react'
import { Button } from '@chakra-ui/core'
export const CustomRadio = React.forwardRef((props, ref) => {
  const { isChecked, isDisabled, value, register, ...rest } = props
  return (
    <Button
      ref={register}
      variant="outline"
      colorScheme={isChecked ? 'brand' : 'gray'}
      aria-checked={isChecked}
      role="radio"
      size="lg"
      my="auto"
      w="100%"
      py={['40px', '60px', '80px', '80px']}
      isDisabled={isDisabled}
      {...rest}
    />
  )
})
