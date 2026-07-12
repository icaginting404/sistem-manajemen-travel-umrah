"use client";

import Card from "@/src/components/atoms/card.component";
import {
    Calendar,
    ChevronRight,
    FileText,
    History,
    Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "@/src/components/atoms/status-badge.component"

type StatusPesanan =
    | "menunggu_pembayaran"
    | "dalam_cicilan"
    | "lunas"
    | "dibatalkan";

type Pesanan = {
    id: number;
    kode_pesanan: string;
    nama_paket: string;
    tanggal_pesan: string;
    harga_paket: number;
    total_dibayar: number;
    sisa_tagihan: number;
    status_pesanan: StatusPesanan;
    flyer: string;
};

const formatRupiah = (angka: number | string) =>
    `Rp ${Number(angka).toLocaleString("id-ID")}`;

const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export default function PesananSayaPage() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [pesanan, setPesanan] = useState<Pesanan[]>([]);

    useEffect(() => {
        const getPesanan = async () => {
            try {
                const user = JSON.parse(
                    localStorage.getItem("user") || "{}"
                );

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/user/${user.id}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                setPesanan(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getPesanan();
    }, []);

    const pesananAktif = pesanan.filter((item) =>
        ["menunggu_pembayaran", "dalam_cicilan"].includes(
            item.status_pesanan
        )
    );

    const riwayatPesanan = pesanan.filter((item) =>
        ["lunas", "expired", "dibatalkan"].includes(
            item.status_pesanan
        )
    );

    if (loading) {
        return (
            <section className="min-h-screen bg-sab-bg-gray p-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-5">
                    {[1, 2].map((item) => (
                        <Card
                            key={item}
                            bgColor="white"
                            outline="none"
                            className="!p-6 animate-pulse"
                        >
                            <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>

                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-sab-bg-gray p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">
                        Pesanan Saya
                    </h1>

                    <p className="text-sab-gray-500 mt-1">
                        Lihat status dan riwayat pemesanan paket umrah Anda.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <FileText
                        size={20}
                        className="text-primary"
                    />

                    <h2 className="text-xl font-bold text-secondary">
                        Sedang Berlangsung
                    </h2>
                </div>

                {pesananAktif.length === 0 ? (
                    <Card
                        bgColor="white"
                        outline="none"
                        className="!p-10 text-center"
                    >
                        <p className="text-sab-gray-500">
                            Belum ada pesanan.
                        </p>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-3">
                        {pesananAktif.map((item) => (
                            <Card
                                key={item.id}
                                bgColor="white"
                                outline="none"
                                className="!p-4"
                            >
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-30 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.flyer}`}
                                            alt={item.nama_paket}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Seluruh isi sebelah kanan */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary">
                                                    {item.nama_paket}
                                                </h3>

                                                <p className="text-sm text-sab-gray-500 mt-1">
                                                    Kode Pesanan :
                                                    <span className="font-semibold ml-2 text-secondary">
                                                        {item.kode_pesanan}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-sab-gray-500 mb-1">
                                                    Status
                                                </p>

                                                <StatusBadge status={item.status_pesanan} />
                                            </div>
                                        </div>

                                        {/* Informasi */}
                                        <div className="border-t border-sab-gray-100 pt-4">
                                            <div className="grid grid-cols-3 mb-6">
                                                <div className="flex items-center gap-2 px-2 border-r border-sab-gray-100">

                                                    <Calendar size={18} className="text-primary" />

                                                    <div>
                                                        <p className="text-xs text-sab-gray-500">
                                                            Tanggal Pesan
                                                        </p>

                                                        <p className="font-semibold text-secondary">
                                                            {formatTanggal(item.tanggal_pesan)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 px-4 border-r border-sab-gray-100">
                                                    <Wallet size={18} className="text-primary" />

                                                    <div>
                                                        <p className="text-xs text-sab-gray-500">
                                                            Harga Paket
                                                        </p>

                                                        <p className="font-semibold text-secondary">
                                                            {formatRupiah(item.harga_paket)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 px-4">
                                                    <div>
                                                        <p className="text-xs text-sab-gray-500">
                                                            Sisa Tagihan
                                                        </p>

                                                        <p className="font-semibold text-secondary">
                                                            {formatRupiah(item.sisa_tagihan)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-auto pt-4">
                                            <button
                                                onClick={() =>
                                                    router.push(`/jamaah/pesanan/${item.id}`)
                                                }
                                                className="flex items-center gap-2 text-primary font-semibold hover:underline"
                                            >
                                                Lihat Detail
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-6">
                    <History size={20} className="text-primary" />

                    <h2 className="text-xl font-bold text-secondary">
                        Riwayat Pesanan
                    </h2>
                </div>

                {riwayatPesanan.length === 0 ? (
                    <Card
                        bgColor="white"
                        outline="none"
                        className="!p-8 text-center"
                    >
                        <p className="text-sab-gray-500">
                            Belum ada riwayat pesanan.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {riwayatPesanan.map((item) => (
                            <Card
                                key={item.id}
                                bgColor="white"
                                outline="none"
                                className="!p-5 h-full"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-secondary">
                                            {item.nama_paket}
                                        </h3>

                                        <p className="text-sm text-sab-gray-500 mt-1">
                                            {item.kode_pesanan}
                                        </p>
                                    </div>

                                    <StatusBadge status={item.status_pesanan} />
                                </div>

                                <div className="border-t my-4" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Tanggal Pesan</span>
                                        <span>{formatTanggal(item.tanggal_pesan)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Harga</span>
                                        <span>{formatRupiah(item.harga_paket)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Sisa Tagihan</span>
                                        <span>{formatRupiah(item.sisa_tagihan)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        router.push(`/jamaah/pesanan/${item.id}`)
                                    }
                                    className="mt-5 text-primary font-semibold flex items-center gap-1 ml-auto"
                                >
                                    Lihat Detail
                                    <ChevronRight size={18} />
                                </button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}