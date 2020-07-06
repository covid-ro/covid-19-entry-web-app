import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, Link as Anchor } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { Layout } from '../components/Layout'
import { ArrowLeftCircle } from 'react-feather'

function Download() {
  return (
    <Layout title="La revedere">
      <WhiteBox p={[2, 8, 8, 8]}>
        <Heading size="lg" lineHeight="32px" fontWeight="bold">
          <Trans id="downloadPage" />
        </Heading>
        <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
          <Trans id="roaming" />
        </Heading>
        <Heading size="md" lineHeight="32px" pt="4" fontWeight="regular">
          <Trans id="problemSms" />
        </Heading>

        <Box
          mt="4"
          mb="16"
          d="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center">
          <Anchor
            href={`${process.env.PUBLIC_URL}/1590397430342-formulardeclaratiepersoanesedereinromania1905152.pdf`}
            mt="8">
            <Button colorScheme="brand" size="lg" w="320px">
              <Trans id="downloadForm" />
            </Button>
          </Anchor>
          <Anchor as={Link} to="/faq" mt="8">
            <Button colorScheme="brand" size="lg" w="320px">
              <Trans id="questionsAnswers" />
            </Button>
          </Anchor>
          <Anchor as={Link} to="/introducere-telefon" mt="8">
            <Button
              colorScheme="brand"
              variant="outline"
              size="lg"
              w="320px"
              leftIcon={<ArrowLeftCircle />}>
              <Trans id="back" />
            </Button>
          </Anchor>
        </Box>
      </WhiteBox>
    </Layout>
  )
}
export default Download
