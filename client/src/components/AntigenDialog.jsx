import React from "react"
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Select,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Box
} from "@mui/material"

export default function AntigenDialog(props) {

    const { open, handleClose } = props

    const antigenOptions = ['None', 'CEA', 'Antigen 2', 'Antigen 3', 'Antigen 4']

    const antigenOptionMenuItems = antigenOptions.map(option => {
        return <MenuItem value={option}>{option}</MenuItem>
    })


    const [port1, setPort1] = React.useState('None')
    const [port2, setPort2] = React.useState('None')
    const [port3, setPort3] = React.useState('None')
    const [port4, setPort4] = React.useState('None')

    const setAntigenForPort = (antigen, portSetter) => {
        portSetter(antigen)
    }

    const submitTest = () => {
        const antigenSelections = {
            port1_antigen: port1,
            port2_antigen: port2,
            port3_antigen: port3,
            port4_antigen: port4
        }

        //TODO: make this actually send a request to the backend
        console.log("Test started")
        console.log(antigenSelections)
        handleClose()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Antigens to Test For</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        For each port on the device, select the antigens you will be testing for. Leave unused ports as "None"
                    </DialogContentText>

                    <Box sx={{ mt: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Port 1</InputLabel>
                                    <Select 
                                        label="Port 1"
                                        value={port1}
                                        onChange={(event) => setAntigenForPort(event.target.value, setPort1)}
                                    >
                                        {antigenOptionMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Port 2</InputLabel>
                                    <Select 
                                        label="Port 2"
                                        value={port2}
                                        onChange={(event) => setAntigenForPort(event.target.value, setPort2)}
                                    >
                                        {antigenOptionMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Port 3</InputLabel>
                                    <Select 
                                        label="Port 3"
                                        value={port3}
                                        onChange={(event) => setAntigenForPort(event.target.value, setPort3)}
                                    >
                                        {antigenOptionMenuItems}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Port 4</InputLabel>
                                    <Select 
                                        label="Port 4"
                                        value={port4}
                                        onChange={(event) => setAntigenForPort(event.target.value, setPort4)}
                                    >
                                        {antigenOptionMenuItems}
                                    </Select>
                                </FormControl>                            
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={submitTest}>Start Test</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}