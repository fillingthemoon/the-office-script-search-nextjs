import { extendTheme } from '@chakra-ui/react'

// Colors
const black = '#1c1c1c'
const grayL = '#d4d4d4'
const grayLL = '#e6e6e6'
const gray = '#828282'
const grayD = '#4a4a4a'
const grayDD = '#333'
const white = '#ffffff'

const primary = '#01161e'
const primaryL = '#01161e'
const primaryD = '#01161e'

const secondary = '#27a7e3'

export { black, grayL, grayLL, gray, grayD, grayDD, white, primary, primaryL }

// Theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: grayD,
      },
    },
  },
  colors: {
    black: {
      500: black,
    },
    secondary: {
      500: secondary
    },
    gray: {
      100: grayLL,
      200: grayL,
      300: gray,
      400: grayD,
      500: grayDD,
    },
    white: {
      500: white,
    },
    primary: {
      100: white,
      200: primaryL,
      500: primary,
      600: primaryD,
    },
    tabs: {
      50: primary,
      100: primary,
      200: primary,
      300: primary,
      400: primary,
      500: primary,
      600: primary,
      700: primary,
      800: primary,
      900: primary,
    },
  },
  fonts: {
    body: 'Open Sans',
    heading: 'Open Sans',
  },
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          bg: 'white',
        },
      },
    },
  },
})

export default theme
