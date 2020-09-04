import { extendTheme } from '@chakra-ui/core'
const theme = extendTheme({
  colors: {
    gray: {
      50: '#F7FAFC',
      100: '#f2f2f2',
      200: '#e7ebed',
      300: '#D0D4DB',
      400: '#A0AEC0',
      500: '#979797',
      600: '#5F5F5F',
      700: '#4a4a4a',
      800: '#1A202C',
      900: '#171923',
    },
    brand: {
      100: '#a8bfda',
      200: '#a8bfdf',
      300: '#a8bfde',
      400: '#a8bfd4',
      500: '#2653B0',
      600: '#00468C',
      700: '#a8bfee',
      800: '#2653B0',
      900: '#00468C',
    },
  },
  fonts: {
    body: "'Open Sans', sans-serif",
    heading: "'Merriweather', serif",
  },
})

export default theme
