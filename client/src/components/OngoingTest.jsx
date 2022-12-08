import React from "react"
import { 
    Container,
    Stack,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent
} from "@mui/material"
import TestStatus from "./TestStatus"
import { getTest } from "../models/test"
import { useLoaderData } from "react-router-dom"


export async function loader() {
    const test = await getTest()
    return { test }
}

export default function OngoingTest() {

    const { test } = useLoaderData()

    const selectedAntigens = Object.values(test)
        .filter(portSelection => portSelection !== "None")
        .join(', ')

    return (
        <Container fixed>
            <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={4}
            >
                <Typography variant='h4' color="text.primary">
                    Testing in Progress
                </Typography>

                <Typography variant="h5" color="text.secondary">
                    Testing for the following antigens: { selectedAntigens }
                </Typography>

                <Typography variant='subtitle2' color="text.secondary">
                    Follow the instructions below to conduct the antigen test
                </Typography>

                <Grid container sx={{ mt: 2 }} spacing={2}>
                    <Grid item xs={4}>
                        <Card>
                            
                            <CardContent>
                                <Typography variant="h5">
                                    Step 1
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Leave the sensors undisturbed in their ports while the test is in the "Calibrating Sensors" stage
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                        <Card>
                            
                            <CardContent>
                                <Typography variant="h5">
                                    Step 2
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Once the test is in the "Testing Sample" stage, drop the test samples on the sensors inserted in the device
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                        <Card>
                            
                            <CardContent>
                                <Typography variant="h5">
                                    Step 3
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Once the test samples have been dropped on the sensors, wait for the test to complete. You will be automatically shown the results
                                    once the test is finished.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sx= {{ mt: 2 }}>
                        <TestStatus />
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    )
}