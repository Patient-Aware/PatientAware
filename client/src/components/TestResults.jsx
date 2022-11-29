import React from "react"
import {
    Container,
    Stack,
    Typography,
    Button
} from "@mui/material"
import AntigenResult from "./AntigenResult"
import { getResults } from "../models/test"
import { useLoaderData } from "react-router-dom"

export async function testResultsLoader() {
    const results = await getResults()
    return { results }
}

export default function TestResults() {

    const { results } = useLoaderData()

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
            </Stack>

        </Container>
    )
}