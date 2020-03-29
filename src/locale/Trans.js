import React, { useContext } from 'react'
import { LanguageContext } from './LanguageContext'
export function Trans({ id }) {
  const languageContext = useContext(LanguageContext)
  if (languageContext.dictionary[id].includes('\n')) {
    return languageContext.dictionary[id].split('\n').map((item, i) => (
      <p key={i} style={{ marginTop: '1rem' }}>
        {item}
      </p>
    ))
  }
  return languageContext.dictionary[id]
}
