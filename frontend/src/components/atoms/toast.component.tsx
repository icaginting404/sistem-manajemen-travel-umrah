"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type ToastProps = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

export default function ToastComponent({
  open,
  message,
  severity,
  onClose,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        mt: 6, // geser ke bawah
      }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        sx={{
          width: "100%",
          borderRadius: "12px",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}