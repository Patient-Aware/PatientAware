import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Home from './components/Home'

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
          <Home></Home>
        </Box>
    </div>
  )
}

export default App