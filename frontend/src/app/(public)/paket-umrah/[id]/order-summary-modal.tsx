"use client";

import { useEffect, useState } from "react";
import Button from "@/src/components/atoms/button.component";
import { AlertCircle } from "lucide-react";
import Modal from "@/src/components/atoms/modal.component";

type PaketUmrah = {
    id: number;
    nama_paket: string;
    jadwal_keberangkatan: string;
    harga: number;
    durasi_perjalanan: string;
    hotel: string;
    total_kuota: number;
    maskapai: string;
    status_paket: string;
    flyer: string;
};

type OrderSummaryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    paket: PaketUmrah;
    onCheckout: (paymentType: "dp" | "lunas") => void;
};

type SyaratKetentuan = {
    id: number;
    isi: string;
};

const formatRupiah = (angka: number) =>
`Rp ${angka.toLocaleString("id-ID")}`;

const formatTanggal = (tanggal: string) =>
new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export default function OrderSummaryModal({
    isOpen,
    onClose,
    paket,
    onCheckout,
}: OrderSummaryModalProps) {
    const [paymentType, setPaymentType] = useState<"dp" | "lunas">("dp");
    const [agreed, setAgreed] = useState(false);
    const [syaratKetentuan, setSyaratKetentuan] = useState<SyaratKetentuan[]>([]);

    useEffect(() => {
        const getSyaratKetentuan = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/syarat-ketentuan`
                );

                const data = await res.json();

                setSyaratKetentuan(data);
            } catch (error) {
                console.log(error);
            }
        };
        getSyaratKetentuan();
    }, []);
    
    if (!isOpen) return null;

    const dpAwal = Math.round(paket.harga * 0.15);

    const nominalBayar =
        paymentType === "dp"
            ? dpAwal
            : paket.harga;

    const sisaPembayaran =
        paymentType === "dp"
            ? paket.harga - dpAwal
            : 0;

    const handleClose = () => {
        setAgreed(false);
        setPaymentType("dp");
        document.getElementById("agreement")?.blur();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="!max-w-lg">
            <h2 className="text-2xl font-bold text-center text-secondary mb-6">
                Ringkasan Pemesanan
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-sab-gray-100 pb-2">
                    <span className="text-sab-gray-500">Paket Umrah </span>
                    <span className="font-semibold text-secondary">
                        {paket.nama_paket}
                    </span>
                </div>

                <div className="flex justify-between border-b border-sab-gray-100 pb-2">
                    <span className="text-sab-gray-500">Keberangkatan</span>
                    <span className="font-semibold">
                        {formatTanggal(paket.jadwal_keberangkatan)}
                    </span>
                </div>

                <div className="flex justify-between border-b border-sab-gray-100 pb-2">
                    <span className="text-sab-gray-500">Durasi</span>
                    <span className="font-semibold">
                        {paket.durasi_perjalanan}
                    </span>
                </div>

                <div className="flex justify-between border-b border-sab-gray-100 pb-2">
                    <span className="text-sab-gray-500">Maskapai</span>
                    <span className="font-semibold">
                        {paket.maskapai}
                    </span>
                </div>

                <div className="flex justify-between border-b border-sab-gray-100 pb-2">
                    <span className="text-sab-gray-500">Hotel</span>
                    <span className="font-semibold">
                        {paket.hotel}
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <p className="font-semibold mb-3">
                    Pilih Pembayaran
                </p>

                <div className="space-y-3">

                    <label
                        className={`flex items-center gap-3 cursor-pointer rounded-xl p-3 border transition
                            ${
                                paymentType === "dp"
                                    ? "border-primary bg-primary/10"
                                    : "border-sab-gray-200"
                            }`}
                    >
                        <input
                            type="radio"
                            checked={paymentType === "dp"}
                            onChange={() => setPaymentType("dp")}
                        />

                        <div>
                            <p className="font-medium">
                                Bayar DP 15%
                            </p>

                            <p className="text-xs text-sab-gray-500">
                                Melakukan pembayaran awal sebesar 15%.
                            </p>
                        </div>
                    </label>

                    <label
                        className={`flex items-center gap-3 cursor-pointer rounded-xl p-3 border transition
                            ${
                                paymentType === "lunas"
                                    ? "border-primary bg-primary/10"
                                    : "border-sab-gray-200"
                            }`}
                    >
                        <input
                            type="radio"
                            checked={paymentType === "lunas"}
                            onChange={() => setPaymentType("lunas")}
                        />

                        <div>
                            <p className="font-medium">
                                Bayar Lunas
                            </p>

                            <p className="text-xs text-sab-gray-500">
                                Langsung melunasi seluruh biaya paket.
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Harga */}
            <div className="mt-6 rounded-2xl bg-primary/10 p-4">
                <div className="flex justify-between text-sm">
                    <span className="text-sab-gray-500">
                        Harga Paket
                    </span>

                    <span className="font-semibold">
                        {formatRupiah(paket.harga)}
                    </span>
                </div>

                <div className="flex justify-between text-sm mt-2">
                    <span className="text-sab-gray-500">
                        {paymentType === "dp"
                            ? "DP Awal"
                            : "Nominal Pelunasan"}
                    </span>

                    <span className="font-semibold text-primary">
                        {formatRupiah(nominalBayar)}
                    </span>
                </div>

                <div className="border-t mt-3 pt-3 flex justify-between">
                    <span className="font-bold text-secondary">
                        Sisa Pembayaran
                    </span>

                    <span className="font-bold text-secondary">
                        {formatRupiah(sisaPembayaran)}
                    </span>
                </div>
            </div>

            {/* Informasi */}
            <div className="mt-4 flex gap-3 bg-yellow-50 border border-primary rounded-2xl p-3">
                <AlertCircle size={18} className="text-primary mt-0.5"/>
                <div>
                    <p className="text-sm font-semibold">
                        Informasi Pembayaran
                    </p>

                    <p className="text-xs text-sab-gray-500 mt-1">
                        {paymentType === "dp"
                            ? "Pembayaran awal sebesar 15% dari harga paket. Sisa pembayaran dapat dilunasi paling lambat H-30 sebelum keberangkatan."
                            : "Anda akan langsung melunasi seluruh biaya paket sehingga tidak memiliki sisa tagihan."}
                    </p>
                </div>
            </div>

            {/* Persetujuan */}
            <div className="mt-5">
                <h3 className="font-semibold text-secondary mb-2">
                    Syarat & Ketentuan
                </h3>

                <div className="max-h-40 overflow-y-auto rounded-xl border border-sab-gray-100 p-3 text-sm text-sab-gray-500">
                    <ul className="list-decimal pl-4 space-y-2">
                        {syaratKetentuan.map((item) => (
                            <li key={item.id}>
                                {item.isi}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-3 flex items-start gap-2">
                    <input
                        type="checkbox"
                        id="agreement"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1"
                    />

                    <label htmlFor="agreement" className="text-sm text-sab-gray-500">
                        Saya telah membaca dan menyetujui syarat & ketentuan yang berlaku.
                    </label>
                </div>
            </div>

            {/* Tombol */}
            <div className="flex items-center gap-3 mt-6">
                <Button
                    label="Batal"
                    color="secondary"
                    variant="contained"
                    radius="oval"
                    className="flex-1 justify-center"
                    onClick={handleClose}
                />

                <Button
                    label="Lanjut Pembayaran"
                    color="primary"
                    variant="contained"
                    radius="oval"
                    className="flex-1 justify-center"
                    onClick={() => onCheckout(paymentType)}
                    disabled={!agreed}
                />
            </div>
        </Modal>
    );
}