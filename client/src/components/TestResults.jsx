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
                <Typography variant='h1'>
                    Test Complete
                </Typography>
                
                {results.map(result => <AntigenResult antigen={result.antigen} detectedLevel={result.detectedLevel} />)}

                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={() => { navigate('/') }}>Return to Home</Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary">Share Results with Care Provider</Button>
                    </Grid>
                </Grid>
            </Stack>

        </Container>
    )
}