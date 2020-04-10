import countries from './countries.json'
import { mapObjIndexed } from 'ramda'
const groupOptionsPhone = (value, key, obj) => {
  return {
    label: key,
    options: value.map((v) => {
      return {
        label: `${v.country} (+${v.calling_code})`,
        value: `+${v.calling_code}`,
      }
    }),
  }
}
const groupedOptionsPhonePrep = mapObjIndexed(groupOptionsPhone, countries)
const groupedPhoneCodes = Object.entries(groupedOptionsPhonePrep).map(
  (a) => a[1]
)

const groupOptionsCountry = (value, key, obj) => {
  return {
    label: key,
    options: value.map((v) => {
      return {
        label: v.country,
        value: v.iso,
      }
    }),
  }
}
const groupedOptionsCountryPrep = mapObjIndexed(groupOptionsCountry, countries)
const groupedCountries = Object.entries(groupedOptionsCountryPrep).map(
  (a) => a[1]
)
export { groupedPhoneCodes, groupedCountries }
