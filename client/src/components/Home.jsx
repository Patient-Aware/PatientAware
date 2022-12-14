import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import AntigenDialog from './AntigenDialog'
import { redirect, useNavigate } from 'react-router-dom'
import { startTest } from '../models/test'

import logo from '../assets/patientaware_logo311_208.png'


export async function onAntigenFormSubmit({ request, params }) {
    const formData = await request.formData()
    const antigenSelections = Object.fromEntries(formData)

    //TODO: make this a POST request to the backend
    console.log("Antigens chosen. Test started")
    console.log(antigenSelections)
    await startTest(antigenSelections)
    return redirect("/in-progress")
}

export default function Home() {

    const [dialogOpen, setDialogOpen] = React.useState(false)

    const navigate = useNavigate()

    return (
        <Container fixed>
            <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <img src={logo} style={{ borderRadius: '2px' }} ></img>
                <Typography variant='h2' color="text.primary">
                    Welcome to PatientAware
                </Typography>
                <Button variant='contained' size='large' sx={{ fontSize: '2em' }} onClick={() => setDialogOpen(true)}>Start Test</Button>
                <Button variant="contained" color="secondary" onClick={() => { navigate('/past-results') }}>View past test results</Button>

                <AntigenDialog open={dialogOpen} handleClose={() => setDialogOpen(false)}/>
            </Stack>

        </Container>
    )
}