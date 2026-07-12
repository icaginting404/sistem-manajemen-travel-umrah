"use client";

import { createContext, useContext, useState } from "react";
import ToastComponent from "@/src/components/atoms/toast.component";

type Severity = "success" | "error" | "warning" | "info";

type ToastContextType = {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
  };
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("success");

  const showToast = (type: Severity, message: string) => {
    setSeverity(type);
    setMessage(message);
    setOpen(true);
  };

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success: (message) => showToast("success", message),
          error: (message) => showToast("error", message),
          warning: (message) => showToast("warning", message),
          info: (message) => showToast("info", message),
        },
      }}
    >
      {children}

      <ToastComponent
        open={open}
        message={message}
        severity={severity}
        onClose={() => setOpen(false)}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider");
  }

  return context;
}