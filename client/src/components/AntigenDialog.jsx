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
import { Form } from "react-router-dom"


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

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <Form method="post">
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
                                            name="port1_antigen" 
                                            label="Port 1"
                                            value={port1}
                                            onChange={(event) => setPort1(event.target.value)}
                                        >
                                            {antigenOptionMenuItems}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Port 2</InputLabel>
                                        <Select
                                            name="port2_antigen" 
                                            label="Port 2"
                                            value={port2}
                                            onChange={(event) => setPort2(event.target.value)}
                                        >
                                            {antigenOptionMenuItems}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Port 3</InputLabel>
                                        <Select
                                            name="port3_antigen" 
                                            label="Port 3"
                                            value={port3}
                                            onChange={(event) => setPort3(event.target.value)}
                                        >
                                            {antigenOptionMenuItems}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Port 4</InputLabel>
                                        <Select
                                            name="port4_antigen" 
                                            label="Port 4"
                                            value={port4}
                                            onChange={(event) => setPort4(event.target.value)}
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
                        <Button type="submit">Start Test</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        </div>
    )
}