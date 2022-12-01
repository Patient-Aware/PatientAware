import React from "react"
import {
    Container,
    Stack,
    Typography,
    Button,
    Grid
} from "@mui/material"
import AntigenResult from "./AntigenResult"
import { getResults } from "../models/test"
import { useLoaderData, useNavigate } from "react-router-dom"

export async function testResultsLoader() {
    const results = await getResults()
    return { results }
}

export default function TestResults() {

    const { results } = useLoaderData()
    const navigate = useNavigate()

    return (
        <Container fixed>
            <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={8}
            >
                <Typography variant='h1' color="text.primary">
                    Test Complete
                </Typography>
                
                <Grid container>
                    {results.map(result => <Grid item xs={5} sx={{ m: 1 }}><AntigenResult antigen={result.antigen} detectedLevel={result.detectedLevel} /></Grid>)}
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={() => { navigate('/') }}>Return to Home</Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" onClick={() => { navigate('/past-results') }}>View past test results</Button>
                    </Grid>
                </Grid>
            </Stack>

        </Container>
    )
}