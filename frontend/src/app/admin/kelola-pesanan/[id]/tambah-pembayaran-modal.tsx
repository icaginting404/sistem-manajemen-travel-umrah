"use client";
import { useState } from "react";
import Modal from "@/src/components/atoms/modal.component";
import Button from "@/src/components/atoms/button.component";
import Input from "@/src/components/atoms/text-input.component";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        tanggalBayar: string,
        jumlah: number
    ) => Promise<void>;
    showToast: (
        message: string,
        severity: "success" | "error" | "warning" | "info"
    ) => void;
};

export default function TambahPembayaranModal({
    isOpen,
    onClose,
    onSubmit,
    showToast,
}: Props) {

    const [tanggalBayar, setTanggalBayar] = useState("");
    const [jumlah, setJumlah] = useState("");

    const formatRupiah = (value: string) => {
        const angka = value.replace(/\D/g, "");
        if (!angka) return "";
        return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleSubmit = async () => {
        const nominal = Number(jumlah.replace(/\./g, ""));

        if (!tanggalBayar) {
            showToast(
                "Tanggal pembayaran wajib diisi",
                "warning"
            );
            return;
        }

        if (nominal <= 0) {
            showToast(
                "Nominal pembayaran wajib diisi",
                "warning"
            );
            return;
        }

        try {
            await onSubmit(
                tanggalBayar,
                nominal
            );

            handleClose();
        } catch (error) {
            console.error(error);

            showToast(
                "Gagal menambahkan pembayaran",
                "error"
            );
        }
    };

    const handleClose = () => {
        setTanggalBayar("");
        setJumlah("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div>
                <h2 className="text-xl font-bold text-secondary mb-8">
                    Tambah Pembayaran
                </h2>

                <div className="space-y-5">
                    <Input
                        label="Tanggal Bayar"
                        type="date"
                        value={tanggalBayar}
                        onChange={(e) =>
                            setTanggalBayar(e.target.value)
                        }
                    />

                    <Input
                        label="Jumlah"
                        placeholder="Masukkan jumlah uang pembayaran"
                        value={jumlah}
                        onChange={(e) =>
                            setJumlah(
                                formatRupiah(e.target.value)
                            )
                        }
                    />

                    <Input
                        label="Keterangan"
                        value="By Admin"
                        disabled
                    />
                </div>

                <div className="flex justify-end gap-3 mt-10">
                    <Button
                        label="Batal"
                        variant="contained"
                        color="secondary"
                        radius="oval"
                        onClick={handleClose}
                    />

                    <Button
                        label="Kirim"
                        variant="contained"
                        color="primary"
                        radius="oval"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Modal>
    );
}