"use client";
import Card from "@/src/components/atoms/card.component";
import {
    Building2,
    Calendar,
    Check,
    Clock3,
    Plane,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "@/src/components/atoms/status-badge.component"
import Script from "next/script";
import useToast from "@/src/hooks/use-toast";
import ToastComponent from "@/src/components/atoms/toast.component";

type StatusPesanan =
    | "menunggu_pembayaran"
    | "dalam_cicilan"
    | "lunas"
    | "dibatalkan";

type RiwayatPembayaran = {
    tanggal: string;
    metode: string;
    jumlah: number;
    keterangan: string;
};

type Pesanan = {
    id: number;
    kode_pesanan: string;
    nama_paket: string;
    flyer: string;
    status_pesanan: StatusPesanan;
    tanggal_pesan: string;
    jadwal_keberangkatan: string;
    durasi_perjalanan: string;
    harga_paket: number;
    total_dibayar: number;
    sisa_tagihan: number;
    hotel: string;
    maskapai: string;
    fasilitas: string[];
    riwayat_pembayaran: RiwayatPembayaran[];
    is_pembayaran_pertama: boolean;
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

export default function DetailPesananPage() {

    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [pesanan, setPesanan] = useState<Pesanan | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [nominal, setNominal] = useState("");
    const { toast, showToast, closeToast } = useToast();

    useEffect(() => {
        const getPesanan = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${params.id}`,
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
    }, [params.id]);

    if (loading) {
        return (
            <section className="min-h-screen bg-sab-bg-gray p-6">
                <div className="max-w-6xl mx-auto">
                    Loading...
                </div>
            </section>
        );
    }

    if (!pesanan) {
        return (
            <section className="min-h-screen bg-sab-bg-gray flex justify-center items-center">
                Data pesanan tidak ditemukan.
            </section>
        );
    }

    const handleBayar = async () => {
        if (pesanan.total_dibayar === 0) {
            createPayment();
            return;
        }

        // pembayaran berikutnya = buka modal
        setShowModal(true);
    };

    const handleHapusPesanan = async () => {
        const confirmDelete = window.confirm(
            "Yakin ingin menghapus pesanan ini?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${pesanan?.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message, "error");
                return;
            }

            showToast("Pesanan berhasil dihapus.", "success");

            setTimeout(() => {
                window.location.href = "/jamaah/pesanan";
            }, 800);
        } catch (error) {
            console.log(error);
        }
    };

    const createPayment = async () => {
        try {
            const body =
                pesanan?.total_dibayar === 0
                    ? {}
                    : {
                        jumlah: Number(nominal),
                    };

            if (
                pesanan?.total_dibayar !== 0 &&
                Number(nominal) < 20000
            ) {
                showToast("Minimal pembayaran adalah Rp20.000.", "warning");
                return;
            }

            if (
                pesanan?.total_dibayar !== 0 &&
                Number(nominal) > pesanan.sisa_tagihan
            ) {
                showToast("Nominal melebihi sisa tagihan.", "warning");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${pesanan?.id}/payment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message, "error");
                return;
            }

            window.snap.pay(data.token, {
                onSuccess() {
                    window.location.href = `/jamaah/pesanan/${pesanan?.id}`;
                },

                onPending() {
                    window.location.href = `/jamaah/pesanan/${pesanan?.id}`;
                },

                onError() {
                    showToast("Pembayaran gagal.", "error");
                },

                onClose() {
                    console.log("Popup ditutup");
                },
            });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="min-h-screen bg-sab-bg-gray p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">
                        Detail Pesanan
                    </h1>

                    <p className="text-sab-gray-500 mt-1">
                        Informasi lengkap mengenai pesanan Anda.
                    </p>
                </div>

                {/* Card 1 */}
                <Card
                    bgColor="white"
                    outline="none"
                    className="!p-4"
                >
                    <div className="flex flex-col lg:flex-row gap-5">
                        <div className="flex gap-4 flex-1">
                            <div className="w-24 h-32 lg:w-20 lg:h-30 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pesanan.flyer}`}
                                    alt={pesanan.nama_paket}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 lg:max-w-[320px] lg:pr-8 lg:border-r border-sab-gray-100">
                                <h2 className="text-lg lg:text-xl font-bold text-secondary">
                                    {pesanan.nama_paket}
                                </h2>

                                <p className="text-sm text-sab-gray-500 mt-1">
                                    Kode Pesanan

                                    <span className="ml-2 font-semibold text-secondary">
                                        {pesanan.kode_pesanan}
                                    </span>
                                </p>

                                <div className="mt-3">
                                    <StatusBadge status={pesanan.status_pesanan} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:items-center gap-4 lg:gap-0">
                            <div className="flex items-center gap-3 lg:w-44 lg:px-2 lg:border-r border-sab-gray-100">
                                <Calendar
                                    size={22}
                                    className="text-primary flex-shrink-0"
                                />

                                <div>
                                    <p className="text-xs text-sab-gray-500">
                                        Keberangkatan
                                    </p>

                                    <p className="font-semibold text-secondary">
                                        {formatTanggal(pesanan.jadwal_keberangkatan)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:w-44 lg:px-2 lg:border-r border-sab-gray-100">
                                <Clock3
                                    size={22}
                                    className="text-primary flex-shrink-0"
                                />

                                <div>
                                    <p className="text-xs text-sab-gray-500">
                                        Durasi
                                    </p>

                                    <p className="font-semibold text-secondary">
                                        {pesanan.durasi_perjalanan}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:w-44 lg:px-2 lg:border-r border-sab-gray-100">
                                <Plane
                                    size={22}
                                    className="text-primary flex-shrink-0"
                                />

                                <div>
                                    <p className="text-xs text-sab-gray-500">
                                        Maskapai
                                    </p>

                                    <p className="font-semibold text-secondary">
                                        {pesanan.maskapai}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:w-44 lg:px-2">
                                <Building2
                                    size={22}
                                    className="text-primary flex-shrink-0"
                                />

                                <div>
                                    <p className="text-xs text-sab-gray-500">
                                        Hotel
                                    </p>

                                    <p className="font-semibold text-secondary">
                                        {pesanan.hotel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Card 2*/}
                <div className="grid lg:grid-cols-[1fr_500px] gap-6">
                    <Card
                        bgColor="white"
                        outline="none"
                        className="!p-6"
                    >
                        <h3 className="text-xl font-bold text-secondary">
                            Fasilitas Paket
                        </h3>

                        <p className="text-sm text-sab-gray-500 mt-1">
                            Seluruh fasilitas yang akan Anda dapatkan dalam paket umrah ini.
                        </p>

                        <div className="border-t border-sab-gray-100 my-5" />

                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-10">
                            {pesanan.fasilitas.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <Check
                                        size={20}
                                        strokeWidth={3}
                                        className="text-primary"
                                    />

                                    <p className="text-secondary">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Ringkasan Pembayaran */}
                    <Card
                        bgColor="white"
                        outline="none"
                        className="!p-6 h-fit"
                    >
                        <h3 className="text-xl font-bold text-secondary mb-6">
                            Ringkasan Pembayaran
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-sab-gray-500">
                                    Harga Paket
                                </p>

                                <p className="text-lg font-bold text-secondary mt-1">
                                    {formatRupiah(pesanan.harga_paket)}
                                </p>
                            </div>

                            <div className="border-t border-sab-gray-100 pt-5">
                                <p className="text-xs text-sab-gray-500">
                                    Sudah Dibayar
                                </p>

                                <p className="text-lg font-bold text-green-600 mt-1">
                                    {formatRupiah(pesanan.total_dibayar)}
                                </p>
                            </div>

                            <div className="border-t border-sab-gray-100 pt-5">
                                <p className="text-xs text-sab-gray-500">
                                    Sisa Tagihan
                                </p>

                                <p className="text-xl font-bold text-red-500 mt-1">
                                    {formatRupiah(pesanan.sisa_tagihan)}
                                </p>
                            </div>
                        </div>

                        {
                            pesanan.status_pesanan !== "lunas" &&
                            pesanan.status_pesanan !== "dibatalkan" && (

                                <button
                                    onClick={handleBayar}
                                    className="w-full mt-8 bg-primary hover:opacity-90 transition rounded-xl py-3 font-semibold text-secondary cursor-pointer"
                                >
                                    Bayar Sekarang
                                </button>
                            )
                        }
                        {
                            pesanan.status_pesanan === "menunggu_pembayaran" &&
                            pesanan.total_dibayar === 0 && (
                                <button
                                    onClick={handleHapusPesanan}
                                    className="w-full mt-3 border border-red-500 text-red-500 hover:bg-red-50 transition rounded-xl py-3 font-semibold cursor-pointer"
                                >
                                    Hapus Pesanan
                                </button>
                            )
                        }
                    </Card>
                </div>

                <Card
                    bgColor="white"
                    outline="none"
                    className="!p-6"
                >
                    <h3 className="text-xl font-bold text-secondary mb-6">
                        Riwayat Pembayaran
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sab-gray-100">
                                    <th className="text-left py-3 text-sm text-sab-gray-500">
                                        Tanggal
                                    </th>

                                    <th className="text-left py-3 text-sm text-sab-gray-500">
                                        Metode
                                    </th>

                                    <th className="text-left py-3 text-sm text-sab-gray-500">
                                        Jumlah
                                    </th>

                                    <th className="text-left py-3 text-sm text-sab-gray-500">
                                        Keterangan
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {pesanan.riwayat_pembayaran?.length ? (
                                    pesanan.riwayat_pembayaran.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-sab-gray-100"
                                        >
                                            <td className="py-4">
                                                {formatTanggal(item.tanggal)}
                                            </td>

                                            <td>
                                                {item.metode}
                                            </td>

                                            <td className="font-semibold">
                                                {formatRupiah(item.jumlah)}
                                            </td>

                                            <td>
                                                {item.keterangan}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center py-8 text-sab-gray-500"
                                        >
                                            Belum ada riwayat pembayaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-[420px]">
                            <h3 className="text-xl font-bold">
                                Pembayaran Cicilan
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Sisa Tagihan
                            </p>

                            <p className="font-bold text-red-500 text-xl mb-5">
                                {formatRupiah(pesanan.sisa_tagihan)}
                            </p>

                            <input
                                type="number"
                                value={nominal}
                                onChange={(e) =>
                                    setNominal(e.target.value)
                                }
                                placeholder="Masukkan nominal pembayaran"
                                className="w-full border rounded-lg px-4 py-3"
                            />

                            <p className="text-xs text-sab-red mt-2">
                                Minimal pembayaran Rp20.000 dan maksimal {formatRupiah(pesanan.sisa_tagihan)}.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border rounded-lg py-3"
                                >
                                    Batal
                                </button>

                                <button
                                    onClick={createPayment}
                                    className="flex-1 bg-primary rounded-lg py-3"
                                >
                                    Bayar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="afterInteractive"
            />
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    )
}