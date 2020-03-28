import React from 'react'
import { Route } from 'react-router-dom'
// import useSWR from 'swr'
// import fetcher from './utils/fetcher'

import { Layout } from './components/Layout'
import { LanguageProvider } from './locale/LanguageContext'
import { Home } from './pages/Home'
// const zone = process.env.REACT_APP_ZONE
// const endpoint = `/client/v4/zones/${zone}/analytics/dashboard?since=2019-04-01T12:23:00Z&until=2020-03-27T12:23:00Z&continuous=false`

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
      </Layout>
    </LanguageProvider>
  )
}
export default App
