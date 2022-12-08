import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"
import "@fontsource/raleway"
import logo from './assets/patientaware_logo124_83.png'


function App() {
  

  const themeOptions = {
    palette: {
      type: 'light',
      primary: {
        main: '#3ADCA1',
      },
      secondary: {
        main: '#1b3840',
      },
      text: {
        primary: '#132f3d',
      },
    },
    typography: {
      fontFamily: "'Raleway', 'Roboto', 'Arial'"
    }
  };

  const patientAwareTheme = createTheme(themeOptions)

  return (
    <div>
        <ThemeProvider theme={patientAwareTheme}>
          <AppBar position='static'>
              <Toolbar>
                  
                  <img src={logo} style={{ width: '80px' }}></img>
                  <Typography variant='h5' component="div" color="text.primary" sx={{ ml: 1 }}>
                      PatientAware
                  </Typography>
              </Toolbar>
          </AppBar>
          <Box sx={{ mt: 2 }}>
            <Outlet />
          </Box>
        </ThemeProvider>
    </div>
  )
}

export default App