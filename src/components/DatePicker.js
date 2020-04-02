import React from 'react'
import { ro } from 'date-fns/locale'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
export const DatePicker = ({
  field: { name, value },
  id,
  required,
  disabled,
  className,
  onChangeDate,
  onDateLeave,
}) => {
  const handleChange = value => {
    onChangeDate(name, value)
  }
  const handleBlur = () => {
    onDateLeave(name, true)
  }
  return (
    <ReactDatePicker
      id={id}
      name={name}
      onChange={handleChange}
      onBlur={handleBlur}
      selected={value}
      required={required}
      dateFormat="dd/MM/yyyy"
      locale={ro}
    />
  )
}
