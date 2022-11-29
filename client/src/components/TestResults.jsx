import React from "react"
import {
    Container,
    Stack,
    Typography,
    Button
} from "@mui/material"

export default function TestResults() {

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
                
            </Stack>

        </Container>
    )
}