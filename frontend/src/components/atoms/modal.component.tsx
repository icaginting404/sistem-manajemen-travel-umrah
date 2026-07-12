"use client";

import React, { ReactNode, useEffect } from "react";
import Card from "@/src/components/atoms/card.component";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
}: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50"/>
      <Card shadow className={`relative z-10 w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto ${className}`} >
        {children}
      </Card>
    </div>
  );
};

export default Modal;