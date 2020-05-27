import React, { useEffect } from 'react'
import ro from 'date-fns/locale/ro'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
export const DatePicker = ({
  name,
  value,
  id,
  locale,
  placeholder,
  required,
  onChangeDate,
  onDateLeave,
  ...rest
}) => {
  useEffect(() => {
    registerLocale('ro-RO', ro)
  })
  const handleChange = (value) => {
    onChangeDate(name, value)
  }
  const handleBlur = () => {
    onDateLeave(name, true, true)
  }
  return (
    <ReactDatePicker
      {...rest}
      id={id}
      name={name}
      onChange={handleChange}
      onBlur={handleBlur}
      selected={value}
      locale={locale === 'ro' ? 'ro-RO' : null}
      required={required}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
    />
  )
}
