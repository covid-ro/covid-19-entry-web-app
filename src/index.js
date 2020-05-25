import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { customTheme } from './theme'
import { LanguageProvider } from './locale/LanguageContext'

import App from './App'
Sentry.init({
  dsn:
    'https://4b39d10c7bb24d43b0fd04e9417e7138@o395451.ingest.sentry.io/5253033',
  environment: process.env.NODE_ENV,
})

ReactDOM.render(
  <ThemeProvider theme={customTheme}>
    <LanguageProvider>
      <CSSReset />
      <Router>
        <App />
      </Router>
    </LanguageProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
