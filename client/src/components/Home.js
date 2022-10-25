import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'


export default function Home() {
    return (
        <Container fixed>
            <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={8}
            >
                <Typography variant='h1'>
                    Welcome to PatientAware
                </Typography>
                <Button variant='contained' size='large' sx={{ fontSize: '2em' }}>Start Test</Button>
            </Stack>

        </Container>
    )
}