import React, { createContext, useContext, useState } from 'react'
import { languageOptions, dictionaryList } from './languages'
import { writeStorage } from '@rehooks/local-storage'
// create the language context with default language, romanian
const storedLanguage = localStorage.getItem('lang') || languageOptions[0].id
export const LanguageContext = createContext({
  language: storedLanguage,
  dictionary: storedLanguage
    ? dictionaryList[storedLanguage]
    : dictionaryList[languageOptions[0].id],
})
// provider
export function LanguageProvider(props) {
  const languageContext = useContext(LanguageContext)
  const [language, setLanguage] = useState(languageContext.language)
  const [dictionary, setDictionary] = useState(languageContext.dictionary)

  const provider = {
    language,
    dictionary,
    setLanguage: (selectedLanguage) => {
      setLanguage(selectedLanguage) // it will update the language in state
      setDictionary(dictionaryList[selectedLanguage])
      writeStorage('lang', selectedLanguage)
    },
  }

  return (
    <LanguageContext.Provider value={provider}>
      {props.children}
    </LanguageContext.Provider>
  )
}
