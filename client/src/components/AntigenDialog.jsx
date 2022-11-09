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
    InputLabel
} from "@mui/material"

export default function AntigenDialog(props) {

    const { open, handleClose } = props

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Antigens to Test For</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        For each port on the device, select the antigens you will be testing for. Leave unused ports as "None"
                    </DialogContentText>

                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Port 1</InputLabel>
                                <Select label="Port 1"></Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Port 2</InputLabel>
                                <Select label="Port 2"></Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Port 3</InputLabel>
                                <Select label="Port 3"></Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel>Port 4</InputLabel>
                                <Select label="Port 4"></Select>
                            </FormControl>                            
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Start Test</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}