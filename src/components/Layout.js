import React from 'react'
import { Helmet } from 'react-helmet'
import { Header } from './Header'
import { Footer } from './Footer'
import { Content } from './Content'
import { Main } from './Main'
export function Layout({ children, title }) {
  return (
    <Content>
      <Helmet title={title} />
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Content>
  )
}
