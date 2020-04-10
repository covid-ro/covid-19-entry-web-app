import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Route } from 'react-router-dom'
// import useSWR from 'swr'
// import fetcher from './utils/fetcher'

import { Layout } from './components/Layout'
import { LanguageProvider } from './locale/LanguageContext'
import { Home } from './pages/Home'
import { Start } from './pages/Start'
import { SubmitPhone } from './pages/SubmitPhone'
import { ValidatePhone } from './pages/ValidatePhone'
import { Declaration } from './pages/Form'
import { Success } from './pages/Success'
import { End } from './pages/End'

function App() {
  // const { data, error } = useSWR(endpoint, fetcher, {
  //   shouldRetryOnError: false,
  // })
  return (
    <LanguageProvider>
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
        <Route path="/success">
          <Success />
        </Route>
        <Route path="/multumim">
          <End />
        </Route>
      </Layout>
    </LanguageProvider>
  )
}
export default hot(App)
