import React from "react"
import {
    Container,
    Stack,
    Typography
} from "@mui/material"

export default function PastResults() {

    return (
        <Container fixed>
        <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            spacing={8}
        >
            <Typography variant='h1' color="text.primary">
                Previous Test Results
            </Typography>
            
        </Stack>

    </Container>
    )
}