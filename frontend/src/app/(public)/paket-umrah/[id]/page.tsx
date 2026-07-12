"use client";

import Button from "@/src/components/atoms/button.component";
import OrderSummaryModal from "./order-summary-modal";
import Card from "@/src/components/atoms/card.component";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock3,
  Download,
  Phone,
  Plane,
  ShieldCheck,
  ShoppingCart,
  UserCheck,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type PaketUmrah = {
    id: number;
    nama_paket: string;
    jadwal_keberangkatan: string;
    harga: number;
    durasi_perjalanan: string;
    hotel: string;
    total_kuota: number;
    kuota_tersedia:number;
    maskapai: string;
    status_paket: string;
    flyer: string;
    fasilitas?: string;
    tidak_termasuk_harga?: string;
};

type KontakDarurat = {
    nama_lengkap: string;
    alamat: string;
    hubungan: string;
    nomor_hp: string;
};

type Profile = {
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_ktp: string;
    jenis_kelamin: string;
    status_perkawinan: string;
    alamat: string;
    kota_kabupaten: string;
    provinsi: string;
    nomor_hp: string;
    kontak_darurat?: KontakDarurat[];
};

const formatRupiah = (angka: number) =>
`Rp ${angka.toLocaleString("id-ID")}`;

const formatTanggal = (tanggal: string) =>
new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

const formatStatusPaket = (status: string) => {
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function DetailPaketUmrahPage() {
    const params = useParams();
    const router = useRouter();

    const { toast, showToast, closeToast } = useToast();
    const [openSummary, setOpenSummary] = useState(false);
    const [paket, setPaket] = useState<PaketUmrah | null>(null);
    const [loading, setLoading] = useState(true);
    const [noWhatsapp, setNoWhatsapp] = useState("");

    const id = params.id as string;

    const isProfileComplete = (profile: Profile) => {
        const kontakUtama = profile.kontak_darurat?.[0];

        return (
            !!profile.nama &&
            !!profile.tempat_lahir &&
            !!profile.tanggal_lahir &&
            !!profile.nomor_ktp &&
            !!profile.jenis_kelamin &&
            !!profile.status_perkawinan &&
            !!profile.alamat &&
            !!profile.kota_kabupaten &&
            !!profile.provinsi &&
            !!profile.nomor_hp &&
            !!kontakUtama?.nama_lengkap &&
            !!kontakUtama?.alamat &&
            !!kontakUtama?.hubungan &&
            !!kontakUtama?.nomor_hp
        );
    };

    const handleDownloadFlyer = async () => {
        if (!flyerUrl) return;

        try {
            const response = await fetch(flyerUrl);

            if (!response.ok) {
                throw new Error("Gagal mengunduh brosur");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;

            // paket bisa null, gunakan optional chaining/koalesensi
            link.download = paket?.flyer ?? "brosur-umrah.jpg";

            document.body.appendChild(link);
            link.click();
            showToast("Brosur berhasil diunduh", "success");

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            showToast("Gagal mengunduh brosur", "error");
        }
    };

    const handleCheckout = async (
        jenis_pembayaran: "dp" | "lunas"
    ) => {
        const token = localStorage.getItem("token");

        if (!token) {
            showToast("Harap login terlebih dahulu", "warning");
            router.push("/login");
            return;
        }

        try {
            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${user.id}`
            );

            const profile: Profile = await res.json();

            if (!isProfileComplete(profile)) {
            showToast(
                "Silakan lengkapi data profil jamaah terlebih dahulu",
                "warning"
            );

                router.push("/jamaah/profile");
                return;
            }

            const createPesanan = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        paket_umrah_id: Number(id),
                        jenis_pembayaran,
                    }),
                }
            );

            const pesanan = await createPesanan.json();

            if (!createPesanan.ok) {
                throw new Error(
                    pesanan.message || "Gagal membuat pesanan"
                );
            }

            // Ambil Snap Token
            const paymentRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/${pesanan.id}/payment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jenis_pembayaran,
                    }),
                }
            );
            const paymentData = await paymentRes.json();

            if (!paymentRes.ok) {
                throw new Error(
                    paymentData.message || "Gagal membuat transaksi pembayaran"
                );
            }

            // Buka popup Midtrans
            window.snap.pay(paymentData.token, {
                onSuccess: function () {
                    showToast("Pembayaran berhasil!", "success");
                },

                onPending: function () {
                    showToast("Pembayaran masih menunggu.", "info");
                },

                onError: function () {
                    showToast("Pembayaran gagal.", "error");
                },

                onClose: function () {
                    showToast("Anda menutup popup pembayaran.", "warning");
                },
            });

        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            } else {
                showToast("Terjadi kesalahan", "error");
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const getData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah/${id}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await res.json();

                setPaket(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getData();
        }
    }, [id]);

    useEffect(() => {
        const getAdminContact = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact`
            );

            const data = await res.json();

            console.log("Response:", data);

            setNoWhatsapp(data.nomor_hp);
        };

        getAdminContact();
    }, []);

    if (loading) {
        return (
            <section className="min-h-screen p-8">
                <p>Loading...</p>
            </section>
        );
    }

    if (!paket) {
        return (
            <section className="min-h-screen flex flex-col justify-center items-center gap-4">
                <p>Paket tidak ditemukan</p>

                <Button
                label="Kembali"
                color="primary"
                radius="oval"
                onClick={() => router.back()}
                />
            </section>
        );
    }

    const flyerUrl = paket.flyer
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${paket.flyer}`
    : null;
    
    const fasilitasList = paket.fasilitas
    ? (JSON.parse(paket.fasilitas) as string[])
    : [];

    const tidakTermasuk = paket.tidak_termasuk_harga
    ? (JSON.parse(paket.tidak_termasuk_harga) as string[])
    : [];

    const isAktif =
    paket.status_paket.toLowerCase() === "aktif";

    const kuotaPenuh = paket.kuota_tersedia <= 0;

    const bisaDipesan = isAktif && !kuotaPenuh;

    return (
        <section className="min-h-screen bg-sab-bg-gray p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[335px_1fr_305px] gap-6">
                    {/* Flyer */}
                    <div>
                        <div className="overflow-hidden rounded-2xl bg-sab-bg-gray shadow">
                            {flyerUrl ? (
                                <img
                                src={flyerUrl}
                                alt={paket.nama_paket}
                                className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="h-[500px] flex items-center justify-center">
                                    Tidak ada flyer
                                </div>
                            )}
                        </div>

                        {flyerUrl && (
                            <button
                                onClick={handleDownloadFlyer}
                                className="mt-3 w-full flex items-center justify-center gap-2 bg-secondary text-primary py-3 rounded-xl font-semibold"
                            >
                                <Download size={16} />
                                Download Brosur
                            </button>
                        )}
                    </div>

                    {/* Konten */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <span
                                className={`text-xs px-3 py-1 rounded-full font-medium
                                    ${
                                    isAktif
                                        ? "border border-primary text-primary"
                                        : "border border-sab-red text-sab-red"
                                    }
                                `}
                            >
                                {formatStatusPaket(paket.status_paket)}
                            </span>

                            <h1 className="text-2xl font-bold text-secondary mt-3">
                                {paket.nama_paket}
                            </h1>

                            <p className="text-sab-gray-500 mt-1">
                                Nikmati perjalanan ibadah umrah bersama paket ini
                                dengan fasilitas terbaik dan pelayanan profesional.
                            </p>
                        </div>

                        {/* Termasuk & Tidak Termasuk */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card bgColor="white" outline="none" className="!p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-sab-green">
                                        Harga Termasuk
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {fasilitasList.map((item) => (
                                        <div key={item} className="flex gap-2 text-sm">
                                            <CheckCircle size={14} className="text-sab-green mt-1"/>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card bgColor="white" outline="none" className="!p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-sab-red">Belum Termasuk</span>
                                </div>

                                <div className="space-y-2">
                                    {tidakTermasuk.map((item) => (
                                        <div key={item} className="flex gap-2 text-sm">
                                            <XCircle size={14} className="text-sab-red mt-1"/>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Detail */}
                        <Card bgColor="white" className="!p-4">
                            <h2 className="font-bold text-xl p-2">
                                Detail Keberangkatan
                            </h2>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3">

                                <InfoItem
                                icon={<Calendar size={18} />}
                                label="Tanggal"
                                value={formatTanggal(
                                    paket.jadwal_keberangkatan
                                )}
                                />

                                <InfoItem
                                icon={<Clock3 size={18} />}
                                label="Durasi"
                                value={paket.durasi_perjalanan}
                                />

                                <InfoItem
                                icon={<Plane size={18} />}
                                label="Maskapai"
                                value={paket.maskapai}
                                />

                                <InfoItem
                                icon={<Building2 size={18} />}
                                label="Hotel"
                                value={paket.hotel}
                                />

                                <InfoItem
                                icon={<Users size={18} />}
                                label="Kuota"
                                value={`${paket.total_kuota} Pax`}
                                />

                                <InfoItem
                                    icon={<UserCheck size={18} />}
                                    label="Kuota Tersedia"
                                    value={`${paket.kuota_tersedia} Pax`}
                                />
                            </div>
                        </Card>

                        <div className="bg-primary/10 border border-primary rounded-2xl p-2 flex gap-3">
                            <AlertCircle className="text-sab-red" />
                            <div>
                                <p className="text-sm font-semibold">Pelunasan maksimal H-30</p>
                                <p className="text-xs text-sab-gray-500">
                                    Harap melakukan pelunasan sebelum jadwal keberangkatan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="bg-white rounded-2xl shadow p-5 sticky top-5">
                            <p className="text-sm text-sab-gray-500 mb-2">
                                Harga Mulai Dari
                            </p>

                            <div className="bg-sab-bg-gray/80 rounded-xl p-3">
                                <h2 className="text-3xl font-bold text-secondary">
                                    {formatRupiah(paket.harga)}
                                </h2>

                                <p className="text-xs text-sab-gray-500 mt-1">/ pax quad</p>
                            </div>
                        
                            <button
                                onClick={() => setOpenSummary(true)}
                                disabled={!bisaDipesan}
                                className={`
                                    w-full mt-5 py-3 rounded-xl font-bold flex justify-center items-center gap-2
                                    ${
                                        bisaDipesan
                                            ? "bg-primary text-secondary hover:opacity-90"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }
                                `}
                            >
                                <ShoppingCart size={18} />

                                {kuotaPenuh
                                    ? "Kuota Penuh"
                                    : !isAktif
                                    ? "Paket Tidak Aktif"
                                    : "Pesan Sekarang"}
                            </button>

                            {noWhatsapp && (
                                <a
                                    href={`https://wa.me/${noWhatsapp.replace(
                                        /^0/,
                                        "+62"
                                    )}?text=${encodeURIComponent(
                                        `Halo, saya tertarik dengan paket ${paket.nama_paket}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-3 gap-2 border-2 border-sab-green text-sab-green py-3 rounded-xl font-semibold flex justify-center"
                                > 
                                    <Phone size={18} />WhatsApp
                                </a>
                            )}      

                            <div className="border-t mt-5 pt-5 space-y-4">
                                <Feature
                                    icon={<ShieldCheck size={18} />}
                                    title="Aman & Terpercaya"
                                    subtitle="Travel Resmi"
                                />

                                <Feature
                                    icon={<Wallet size={18} />}
                                    title="Pembayaran Mudah"
                                    subtitle="Transfer Bank/Tunai"
                                />

                                <Feature
                                    icon={<Users size={18} />}
                                    title="Bimbingan Manasik"
                                    subtitle="Sebelum Berangkat"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OrderSummaryModal
                isOpen={openSummary}
                onClose={() => setOpenSummary(false)}
                paket={paket}
                onCheckout={handleCheckout}
            />
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="p-4 border border-sab-bg-gray rounded-2xl">
            <div className="flex items-center gap-2 text-sab-gray-500 text-sm">
                {icon}
                {label}
            </div>

            <p className="font-semibold text-sm text-secondary mt-1">
                {value}
            </p>
        </div>
    );
}

function Feature({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="bg-sab-bg-gray p-2 rounded-full">
                {icon}
            </div>

            <div>
                <p className="font-semibold text-secondary text-sm">
                    {title}
                </p>

                <p className="text-xs text-sab-gray-500">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}