import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'
import { customTheme } from './theme'

import App from './App'

ReactDOM.render(
  // <React.StrictMode>
  <ThemeProvider theme={customTheme}>
    <CSSReset />
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
)
