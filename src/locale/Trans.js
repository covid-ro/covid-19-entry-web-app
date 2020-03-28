import { useContext } from 'react'
import { LanguageContext } from './LanguageContext'
export function Trans({ id }) {
  const languageContext = useContext(LanguageContext)
  return languageContext.dictionary[id]
}
