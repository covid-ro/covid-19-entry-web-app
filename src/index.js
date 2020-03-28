import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { customTheme } from './theme'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
