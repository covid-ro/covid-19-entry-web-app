import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core'
import { customTheme } from './theme'
import { LanguageProvider } from './locale/LanguageContext'

import App from './App'
import ScrollToTop from './components/ScrollToTop'
Sentry.init({
  dsn:
    'https://4b39d10c7bb24d43b0fd04e9417e7138@o395451.ingest.sentry.io/5253033',
  environment: process.env.NODE_ENV,
})

ReactDOM.render(
  <ThemeProvider theme={customTheme}>
    <ColorModeProvider>
      <LanguageProvider>
        <Helmet titleTemplate={`%s | Covid-SAFE@Frontieră`} />
        <CSSReset />
        <Router>
          <ScrollToTop />
          <App />
        </Router>
      </LanguageProvider>
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
