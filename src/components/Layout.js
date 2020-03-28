import React from 'react'
import { Switch } from 'react-router-dom'
import { Header } from './Header'
import { Content } from './Content'
import { Main } from './Main'
export function Layout({ children }) {
  return (
    <Switch>
      <Content>
        <Header />
        <Main>{children}</Main>
      </Content>
    </Switch>
  )
}
