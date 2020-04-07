import React from 'react'
import { VisuallyHidden, ControlBox } from '@chakra-ui/core'
export function CustomCheckBox({ children, value, onChange, ...rest }) {
  return (
    <label>
      {/* This is the sibling input, it's visually hidden */}
      <VisuallyHidden
        as="input"
        type="checkbox"
        onChange={onChange}
        value={value}
      />

      {/* This is the control box with a check icon as children */}
      <ControlBox
        w="260px"
        height="120px"
        borderWidth="1px"
        borderRadius="4px"
        textAlign="center"
        fontWeight="semibold"
        fontSize="18px"
        px="30px"
        cursor="pointer"
        py={['40px', '60px', '80px', '80px']}
        _checked={{ borderColor: 'brand.500' }}>
        {children}
      </ControlBox>
    </label>
  )
}
