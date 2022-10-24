import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

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
    </div>
  )
}

export default App