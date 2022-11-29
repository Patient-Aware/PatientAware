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
                <Typography variant='h3' color="text.primary">
                    Testing in Progress
                </Typography>

                <Typography variant="h5" color="text.secondary">
                    Testing for the following antigens: { selectedAntigens }
                </Typography>

                <Typography variant='subtitle2' color="text.secondary">
                    Follow the instructions below to conduct the antigen test
                </Typography>

                <Grid container sx={{ mt: 4 }} spacing={2}>
                    <Grid item xs={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                alt="Step 1 demonstration"
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 1
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Follow these instructions to perform step 1 of the testing process
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                alt="Step 2 demonstration"
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 2
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Follow these instructions to perform step 2 of the testing process
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                alt="Step 3 demonstration"
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Step 3
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Follow these instructions to perform step 3 of the testing process
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sx= {{ mt: 6 }}>
                        <TestStatus />
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    )
}