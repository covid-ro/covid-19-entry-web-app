import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Helmet } from 'react-helmet'
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
      <Helmet titleTemplate={`%s | Covid-SAFE@Frontiera`}>
        <meta name="description" content="Covid-SAFE@Frontiera" />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={process.env.PUBLIC_URL} />
        <meta property="og:locale" content="ro_RO" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Covid-SAFE@Frontiera" />
        <meta
          property="og:description"
          content="Această aplicație este pusă la dispoziție de Guvernul României și stă la baza declarației de intrare în țară la punctele vamale, urmare a pandemiei de coronavirus COVID-19."
        />
        <meta property="og:url" content={process.env.PUBLIC_URL} />
        <meta property="og:site_name" content="Covid-SAFE@Frontiera" />
        <meta property="og:image" content="logo192.png" />
        <meta property="og:image:secure_url" content="logo192.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta name="twitter:card" content="logo192.png" />
        <meta
          name="twitter:description"
          content="Această aplicație este pusă la dispoziție de Guvernul României și stă la baza declarației de intrare în țară la punctele vamale, urmare a pandemiei de coronavirus COVID-19."
        />
        <meta name="twitter:title" content="Covid-SAFE@Frontiera  " />
        <meta name="twitter:image" content="logo192.png" />
        <script src="https://cdn.polyfill.io/v3/polyfill.min.js?features=Array.prototype.entries,Array.prototype.filter,Array.prototype.includes,Array.prototype.lastIndexOf,Array.prototype.map,Array.prototype.values,document,fetch,JSON,localStorage,Map,Object.assign,Object.entries,Promise,Set,String.prototype.includes"></script>
      </Helmet>
      <CSSReset />
      <Router>
        <App />
      </Router>
    </LanguageProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
