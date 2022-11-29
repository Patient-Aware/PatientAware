import React from "react"
import { 
    Card, 
    CardContent,
    Typography
} from "@mui/material"

export default function AntigenResult(props) {

    const { antigen, detectedLevel } = props

    const antigenInfo = {
        'CEA': {
            longName: 'Carcinoembryonic Antigen',
            unhealthyLevel: 10
        },
        'CA19-9': {
            longName: 'Carbohydrate Antigen',
            unhealthyLevel: 3
        },
        'KRAS': {
            longName: "Kirsten Rat Sarcoma Vital Oncogene Homolog",
            unhealthyLevel: 1
        },
        'BRAF V600E': {
            longName: "BRAF V600E",
            unhealthyLevel: 0.1
        }
    }

    const antigenDetails = antigenInfo[antigen]
    const isHealthy = detectedLevel < antigenDetails.unhealthyLevel

    return (
        <Card sx={{ width: "100%" }}>
            <CardContent>
                <Typography variant="h5">
                    { antigen }
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    { antigenDetails.longName }
                </Typography>

                <Typography variant="h6" color={ isHealthy ? "success.light" : "error" }>
                    { isHealthy ? "Healthy" : "Unhealthy" }
                </Typography>

                <meter style={{ width: '80%', height: '100%', }} value={detectedLevel} optimum={antigenDetails.unhealthyLevel * 0.5} low={antigenDetails.unhealthyLevel * 0.8}  high={antigenDetails.unhealthyLevel} max={antigenDetails.unhealthyLevel * 2}></meter>


                <Typography>{detectedLevel} ng/mL of {antigen} detected in the test sample</Typography>

                <Typography variant="body2" color="text.secondary">
                    Levels less than {antigenDetails.unhealthyLevel} ng/mL are considered healthy
                </Typography>
            </CardContent>
        </Card>
    )
}