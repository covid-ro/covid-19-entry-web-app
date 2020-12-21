import React from 'react'
import { Box, Flex, Stack, Text } from '@chakra-ui/core'
import { Trans } from '../locale/Trans'
import cn from '../assets/images/cn-full.svg'
import sts from '../assets/images/logo.png'
import uni from '../assets/images/uni.jpg'
export function Footer() {
  return (
    <Flex width='100%' maxW='760px' mx='auto' px={[2, 4, 10]}>
      <Box
        borderColor='gray.200'
        borderWidth='1px 1px 0 1px'
        borderTopRadius='lg'
        textAlign='center'
        bg='white'
        color='brand.900'
        w='100%'>
        <Text fontSize='16px' color='black' maxW='60ch' mx='auto' my='6'>
          <Trans id='footer' />
        </Text>
        <Stack direction={['column', 'row']} alignItems='center' justifyContent='center'>
          <img src={sts} alt={<Trans id='sts' />} height={30} width={30} style={{ marginRight: 20 }} />
          <img height={40} src={cn} alt='Citizen Next' />
          <img width={140} src={uni} alt='Unicredit' />
        </Stack>
      </Box>
    </Flex>
  )
}
