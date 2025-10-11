import { Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button } from "@mui/material" 
 

const ConfirmationDialog = ({ open, role, user, confirm, cancel }) => {
  return(
  <Dialog open={open} >
    <DialogContent>
      <DialogTitle>Confirm Role Change</DialogTitle>
      <DialogContentText>
        Are you sure you want to change <b>{user}'s</b> role to <b>{role}</b>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" color="primary" onClick={confirm}>
        Confirm
      </Button>
      <Button variant="contained" color="error" onClick={cancel}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
  )
};

export default ConfirmationDialog
