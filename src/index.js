import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, CSSReset } from '@chakra-ui/core'
import theme from './chakra'
import { LanguageProvider } from './locale/LanguageContext'

import App from './App'
import ScrollToTop from './components/ScrollToTop'
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn:
      'https://4b39d10c7bb24d43b0fd04e9417e7138@o395451.ingest.sentry.io/5253033',
    environment: process.env.NODE_ENV,
  })
}

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <LanguageProvider>
      <Helmet titleTemplate={`%s | Covid-SAFE@Frontieră`} />
      <CSSReset />
      <Router>
        <ScrollToTop />
        <App />
      </Router>
    </LanguageProvider>
  </ChakraProvider>,
  document.getElementById('root')
)
