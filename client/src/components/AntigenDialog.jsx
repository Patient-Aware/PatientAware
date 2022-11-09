import React from "react"
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Start Test</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}