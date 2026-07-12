import { useState } from "react";

type ToastSeverity =
    | "success"
    | "error"
    | "warning"
    | "info";

export default function useToast() {
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success" as ToastSeverity,
    });

    const showToast = (
        message: string,
        severity: ToastSeverity
    ) => {
        setToast({
            open: true,
            message,
            severity,
        });
    };

    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return {
        toast,
        showToast,
        closeToast,
    };
}