import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import AntigenDialog from './AntigenDialog'
import { redirect } from 'react-router-dom'

export async function onAntigenFormSubmit({ request, params }) {
    const formData = await request.formData()
    
    //TODO: make this a POST request to the backend
    console.log("Antigens chosen. Test started")
    console.log(formData)
    return redirect("/in-progress")
}

export default function Home() {

    const [open, setOpen] = React.useState(false)

    const openAntigenDialog = () => {
        setOpen(true)
    }

    const closeAntigenDialog = () => {
        setOpen(false)
    }

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
                <Button variant='contained' size='large' sx={{ fontSize: '2em' }} onClick={openAntigenDialog}>Start Test</Button>
                <AntigenDialog open={open} handleClose={closeAntigenDialog}/>
            </Stack>

        </Container>
    )
}