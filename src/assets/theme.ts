import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#E3E3E3',
    },
    secondary: {
      main: '#1A1A1A',
      dark: '#535bf2',
      contrastText: '#E3E3E3',
    },
  },
})

export { theme }
