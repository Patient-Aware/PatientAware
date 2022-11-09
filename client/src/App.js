import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet } from "react-router-dom"

function App() {
  
  return (
    <div>
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
    </div>
  )
}

export default App