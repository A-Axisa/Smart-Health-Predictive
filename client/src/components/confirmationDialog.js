import { Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button } from "@mui/material" 


// Reusable confirmation dialog with fully controlled content/styles by caller.
// Props:
// - open: boolean
// - title: string | ReactNode
// - message: string | ReactNode
// - confirm: () => void
// - cancel: () => void
// - confirmText: string
// - cancelText: string
// - confirmColor: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
// - cancelColor: same as above
const ConfirmationDialog = ({ open, title, message, confirm, cancel, confirmText, cancelText, confirmColor, cancelColor }) => {
  return(
  <Dialog open={open} >
    <DialogContent>
      {title && <DialogTitle>{title}</DialogTitle>}
      {message && (
        <DialogContentText>
          {message}
        </DialogContentText>
      )}
    </DialogContent>
    <DialogActions>
      <Button variant="contained" color={confirmColor} onClick={confirm}>
        {confirmText}
      </Button>
      <Button variant="contained" color={cancelColor} onClick={cancel}>
        {cancelText}
      </Button>
    </DialogActions>
  </Dialog>
  )
};

export default ConfirmationDialog
