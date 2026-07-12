"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import Card from "@/src/components/atoms/card.component";
import Button from "@/src/components/atoms/button.component";
import Table from "@/src/components/atoms/table.component";
import StatusBadge from "@/src/components/atoms/status-badge.component";
import TambahPembayaranModal from "./tambah-pembayaran-modal";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type StatusPesanan =
    | "menunggu_pembayaran"
    | "dalam_cicilan"
    | "lunas"
    | "dibatalkan";

type RiwayatPembayaran = {
    id: number;
    tanggal: string;
    metode: string;
    jumlah: number;
    keterangan: string;
};

type Pesanan = {
    id: number;
    nama: string;
    nama_paket: string;
    jadwal_keberangkatan: string;
    harga_paket: number;
    total_dibayar: number;
    sisa_tagihan: number;
    status_pesanan: StatusPesanan;
    riwayat_pembayaran: RiwayatPembayaran[];
};

const formatRupiah = (angka: number) =>
    `Rp ${angka.toLocaleString("id-ID")}`;

const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export default function DetailPesananAdminPage() {

    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [pesanan, setPesanan] = useState<Pesanan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast, showToast, closeToast } = useToast();

    const getDetail = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${params.id}`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal mengambil detail pesanan"
                );
            }

            setPesanan(data);
        } catch (error) {
            console.error(error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Gagal mengambil detail pesanan",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getDetail();
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <section className="bg-sab-bg-gray min-h-screen p-6">
                Loading...
            </section>
        );
    }

    if (!pesanan) {
        return (
            <section className="bg-sab-bg-gray min-h-screen flex justify-center items-center">
                Data tidak ditemukan.
            </section>
        );
    }

    const tableData = (pesanan.riwayat_pembayaran ?? []).map((item) => [
        formatTanggal(item.tanggal),
        formatRupiah(item.jumlah),
        item.keterangan,
    ]);

    const handleTambahPembayaran = async (
        tanggalBayar: string,
        jumlah: number
    ) => {
        if (jumlah > pesanan!.sisa_tagihan) {
            showToast(
                "Nominal melebihi sisa tagihan",
                "warning"
            );
            return;
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${pesanan?.id}/admin-payment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tanggal_bayar: tanggalBayar,
                    jumlah,
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            showToast(
                data.message || "Gagal menambahkan pembayaran",
                "error"
            );
            return;
        }

        showToast(
            "Pembayaran berhasil ditambahkan",
            "success"
        );

        setIsModalOpen(false);

        await getDetail();
    };

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold">
                        Detail Pesanan
                    </h1>
                </div>

                <Card
                    bgColor="white"
                    outline="none"
                    className="!p-6 mb-8"
                >
                    <div className="grid grid-cols-[220px_1fr] gap-y-4 text-secondary">
                        <p className="font-semibold">Nama Jamaah</p>
                        <p>: {pesanan.nama}</p>

                        <p className="font-semibold">Nama Paket</p>
                        <p>: {pesanan.nama_paket}</p>

                        <p className="font-semibold">Keberangkatan</p>
                        <p>: {formatTanggal(pesanan.jadwal_keberangkatan)}</p>

                        <p className="font-semibold">Harga Paket</p>
                        <p>: {formatRupiah(pesanan.harga_paket)}</p>

                        <p className="font-semibold">Total Terbayarkan</p>
                        <p>: {formatRupiah(pesanan.total_dibayar)}</p>

                        <p className="font-semibold">Sisa Tagihan</p>
                        <p>: {formatRupiah(pesanan.sisa_tagihan)}</p>

                        <p className="font-semibold">Status</p>

                        <div>
                            <StatusBadge status={pesanan.status_pesanan}/>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-between items-center mb-3 px-2">
                    <h2 className="text-xl font-bold">
                        Riwayat Pembayaran
                    </h2>

                    {pesanan.status_pesanan !== "lunas" &&
                    pesanan.status_pesanan !== "dibatalkan" && (
                        <Button
                            label="Tambah Pembayaran"
                            prefix={<Plus size={16} />}
                            radius="oval"
                            onClick={() => setIsModalOpen(true)}
                        />
                    )}

                    <TambahPembayaranModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleTambahPembayaran}
                        showToast={showToast}
                    />
                </div>

                <Table
                    headers={[
                        "Tanggal",
                        "Jumlah",
                        "Keterangan",
                    ]}
                    data={tableData}
                />
            </div>
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    );
}