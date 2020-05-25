import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { SubmitPhone } from './pages/SubmitPhone'
import { ValidatePhone } from './pages/ValidatePhone'
import { Declaration } from './pages/Form'
import { Success } from './pages/Success'
import { End } from './pages/End'
import NoMatch from './pages/NoMatch'

function App() {
  useEffect(() => {
    loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY)
  })
  return (
    <Switch>
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
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  )
}
export default hot(App)
