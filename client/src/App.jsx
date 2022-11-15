import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"

function App() {
  

  const themeOptions = {
    palette: {
      type: 'light',
      primary: {
        main: '#25d897',
      },
      secondary: {
        main: '#f50057',
      },
      text: {
        primary: '#132f3d',
      },
    },
  };

  const patientAwareTheme = createTheme(themeOptions)

  return (
    <div>
        <ThemeProvider theme={patientAwareTheme}>
          <AppBar position='static'>
              <Toolbar>
                  <Typography variant='h5' component="div">
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