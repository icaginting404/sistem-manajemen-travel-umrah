"use client";

import { AlertTriangle } from "lucide-react";
import Button from "./button.component";

type ConfirmationModalProps = {
    open: boolean;
    title?: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmationModal({
    open,
    title = "Konfirmasi",
    description,
    confirmText = "Ya",
    cancelText = "Batal",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={!loading ? onCancel : undefined}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-7">

                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle
                                size={34}
                                className="text-red-600"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-secondary">
                        {title}
                    </h2>

                    {/* Description */}
                    <p className="text-center text-sab-gray-500 mt-3 leading-relaxed">
                        {description}
                    </p>

                    {/* Button */}
                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            label={cancelText}
                            color="secondary"
                            radius="oval"
                            onClick={onCancel}
                            disabled={loading}
                        />

                        <Button
                            label={
                                loading
                                    ? "Memproses..."
                                    : confirmText
                            }
                            color="danger"
                            radius="oval"
                            onClick={onConfirm}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}