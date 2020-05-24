import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { SubmitPhone } from './pages/SubmitPhone'
import { ValidatePhone } from './pages/ValidatePhone'
import { Declaration } from './pages/Form'
import { Success } from './pages/Success'
import { End } from './pages/End'

function App() {
  useEffect(() => {
    loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY)
  })
  return (
    <Layout>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/start">
        <Start />
      </Route>
      <Route path="/introducere-telefon">
        <SubmitPhone />
      </Route>
      <Route path="/validare-telefon">
        <ValidatePhone />
      </Route>
      <Route path="/declaratie">
        <Declaration />
      </Route>
      <Route path="/succes">
        <Success />
      </Route>
      <Route path="/multumim">
        <End />
      </Route>
    </Layout>
  )
}
export default hot(App)
