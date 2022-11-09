import React from "react"
import { 
    Container,
    Stack,
    Typography
} from "@mui/material"

export default function OngoingTest() {

    return (
        <Container fixed>
            <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={8}
            >
                <Typography variant='h3'>
                    Testing in Progress
                </Typography>
            </Stack>
        </Container>
    )
}