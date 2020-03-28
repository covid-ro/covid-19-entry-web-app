import { theme } from '@chakra-ui/core'
const breakpoints = ['360px', '768px', '1024px', '1440px']
breakpoints.sm = breakpoints[0]
breakpoints.md = breakpoints[1]
breakpoints.lg = breakpoints[2]
breakpoints.xl = breakpoints[3]
// Let's say you want to add custom colors
export const customTheme = {
  ...theme,
  breakpoints,
  fonts: {
    body: "'Open Sans', sans-serif",
    heading: "'Merriweather', serif",
  },
  colors: {
    ...theme.colors,
    gray: {
      ...theme.colors.gray,
      100: '#f2f2f2',
      200: '#e7ebed',
      300: '#D0D4DB',
      500: '#979797',
      600: '#5F5F5F',
      700: '#4a4a4a',
    },
    brand: {
      900: '#00468C',
      800: '#2653B0',
      700: '#a8bfda',
    },
  },
}
