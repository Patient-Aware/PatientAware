import React from "react"
import {
    Container,
    Stack,
    Typography,
    Box,
    Button
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { getPastTests } from "../models/test"
import { useLoaderData, useNavigate } from "react-router-dom"

export async function pastResultsLoader() {
    const past_results = await getPastTests()
    console.log(past_results)
    return { past_results }
}

export default function PastResults() {

    const { past_results } = useLoaderData()

    const navigate = useNavigate()

    const columns = [
        { field: 'date', headerName: 'Test Date', width: 200 },
        { field: 'cea', headerName: 'CEA', width: 150 },
        { field: 'ca19_9', headerName: 'CA19-9', width: 150 },
        { field: 'kras', headerName: 'KRAS', width: 150 },
        { field: 'braf_v600e', headerName: 'BRAF V600E', width: 150 }
    ]

    const rows = past_results.map(test => {

        const cea_result = test.find(result => result.antigen === 'CEA')
        const ca19_9_result = test.find(result => result.antigen === 'CA19-9')
        const kras_result = test.find(result => result.antigen === 'KRAS')
        const braf_v600e_result = test.find(result => result.antigen === 'BRAF V600E')


        return {
            id: crypto.randomUUID(),
            date: new Date(Date.now()).toDateString(),
            cea: cea_result ? `${cea_result.detectedLevel} ng/mL  ${ cea_result.detectedLevel >= 10 ? String.fromCodePoint(0x274c) : String.fromCodePoint(0x2705) }` : '',
            ca19_9: ca19_9_result ? `${ca19_9_result.detectedLevel} ng/mL ${ ca19_9_result.detectedLevel >= 3 ? String.fromCodePoint(0x274c) : String.fromCodePoint(0x2705) }` : '',
            kras: kras_result ? `${kras_result.detectedLevel} ng/mL ${ kras_result.detectedLevel >= 1 ? String.fromCodePoint(0x274c) : String.fromCodePoint(0x2705) }` : '',
            braf_v600e: braf_v600e_result ? `${braf_v600e_result.detectedLevel} ng/mL ${ braf_v600e_result.detectedLevel >= 0.1 ? String.fromCodePoint(0x274c) : String.fromCodePoint(0x2705) }` : '' 
        }
    })

    return (
        <Container fixed>
        <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
        >
            <Typography variant='h3' color="text.primary">
                Previous Test Results
            </Typography>
            
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid columns={columns} rows={rows} />
            </Box>

            <Button variant="contained" onClick={() => { navigate('/') }}>Return to Home</Button>
        </Stack>

    </Container>
    )
}