import React, { useContext } from 'react'
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import { WhiteBox } from '../components/WhiteBox'
import { LanguageContext } from '../locale/LanguageContext'
import { Layout } from '../components/Layout'
import faqs from '../assets/data/faqs.json'
function Faq() {
  const languageContext = useContext(LanguageContext)
  return (
    <Layout title="La revedere">
      <WhiteBox p={[1, 8]}>
        <Heading size="lg" lineHeight="32px" fontWeight="bold" mb="12">
          <Trans id="questionsAnswers" />
        </Heading>
        <Accordion allowMultiple>
          {faqs[languageContext.language].map((faq, index) => (
            <AccordionItem key={index}>
              <AccordionHeader pl="0">
                <Box flex="1" textAlign="left" fontWeight="700">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionHeader>
              <AccordionPanel pl="0" pb={4}>
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </WhiteBox>
    </Layout>
  )
}
export default Faq
