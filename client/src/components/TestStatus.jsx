import React from "react"
import {
    LinearProgress,
    Stack,
    Typography
} from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function TestStatus(props) {

    //TODO: display the selected antigens on the page

    const [progress, setProgress] = React.useState(0)
    const [minutesLeft, setMinutesLeft] = React.useState(15)

    const navigate = useNavigate()

    const testStage = (progress) => {
        if (progress >= 100) {
            return 'Test Complete'
        }

        return (progress < 35 ? "Calibrating sensor" : "Testing sample")
    }

    React.useEffect(() => {
        //TODO: change this to regularly query the backend for the status of the test
        const timer = setInterval(() => {
            setProgress(progress + 7)
            setMinutesLeft(minutesLeft - 1)
        }, 6000)
        
        if (progress >= 100) {
            setProgress(100)
            clearInterval(timer)
            navigate('/results')
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