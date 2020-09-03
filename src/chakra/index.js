import defaultTheme from '@chakra-ui/theme'
const zIndices = {
  hide: -1,
  auto: 'auto',
  base: 0,
  modal: 999,
  sticky: 9999,
}
const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
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
  zIndices,
  fonts: {
    body: "'Open Sans', sans-serif",
    heading: "'Merriweather', serif",
  },
}
export default theme

// import foundations from './foundations'
// import components from './components'
// import styles from './styles'
// /**
//  * Color mode config
//  */
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: 'light',
// }
// const theme = {
//   ...foundations,
//   components,
//   styles,
//   config,
// }
// export default theme
