import { hot } from 'react-hot-loader/root'
import React, { Suspense, lazy, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { Spinner, Center } from '@chakra-ui/core'
import './assets/css/sigStyles.css'
const Home = lazy(() => import('./pages/Home'))
const Start = lazy(() => import('./pages/Start'))
const SubmitPhone = lazy(() => import('./pages/SubmitPhone'))
const ValidatePhone = lazy(() => import('./pages/ValidatePhone'))
const Declaration = lazy(() => import('./pages/Form'))
const Success = lazy(() => import('./pages/Success'))
const End = lazy(() => import('./pages/End'))
const NoMatch = lazy(() => import('./pages/NoMatch'))
const Faq = lazy(() => import('./pages/Faq'))
const Download = lazy(() => import('./pages/Download'))

function App() {
  useEffect(() => {
    loadReCaptcha(process.env.REACT_APP_RECAPTCHA_KEY)
  })
  return (
    <Suspense
      fallback={
        <Center width="full" height="100vh">
          <Spinner
            thickness="2px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
        </Center>
      }>
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
        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/descarca-tip">
          <Download />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Suspense>
  )
}
export default hot(App)
