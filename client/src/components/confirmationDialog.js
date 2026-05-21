import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

/**
 * A confirmation dialog with fully controlled content/styles by caller.
 *
 * @param {Object} props
 * @param {boolean} [props.open]
 * @param {string | ReactNode} [props.title]
 * @param {string | ReactNode} [props.message]
 * @param {function} [props.confirm]
 * @param {function} [props.cancel]
 * @param {string} [props.confirmText]
 * @param {string} [props.cancelText]
 * @param {string} [props.confirmColor] primary, secondary, error, info, success, warning
 * @param {string} [props.cancelColor] Same as above
 * @returns {@mui.material.Dialog}
 */
const ConfirmationDialog = ({
  open,
  title,
  message,
  confirm,
  cancel,
  confirmText,
  cancelText,
  confirmColor,
  cancelColor,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        {title && <DialogTitle>{title}</DialogTitle>}
        {message && <DialogContentText>{message}</DialogContentText>}
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
  );
};

export default ConfirmationDialog;
