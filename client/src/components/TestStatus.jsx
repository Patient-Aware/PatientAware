import React from "react"
import {
    LinearProgress,
    Stack,
    Typography
} from "@mui/material"

export default function TestStatus(props) {

    const [progress, setProgress] = React.useState(0)
    const [minutesLeft, setMinutesLeft] = React.useState(15)

    const testStage = (progress) => {
        if (progress >= 100) {
            return 'Test Complete'
        }

        return (progress < 35 ? "Calibrating sensor" : "Testing sample")
    }

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress(progress + 7)
            setMinutesLeft(minutesLeft - 1)
        }, 6000)
        
        if (progress >= 100) {
            setProgress(100)
            clearInterval(timer)
        }

        return () => {
            clearInterval(timer)
        }
    })

    return (
        <Stack>
            <Typography variant="h6" gutterBottom>
                Stage: { testStage(progress) }
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Time remaining: { minutesLeft } minutes
            </Typography>
            <LinearProgress variant="determinate" value={progress}></LinearProgress>
        </Stack>
    )
}