"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/src/components/atoms/table.component";
import Button from "@/src/components/atoms/button.component";
import StatusBadge from "@/src/components/atoms/status-badge.component";
import Card from "@/src/components/atoms/card.component";

type PaketFilter = {
    id: number;
    nama_paket: string;
};


type Pesanan = {
    id: number;
    nama: string;
    nama_paket: string;
    harga_paket: number;
    total_dibayar: number;
    sisa_tagihan: number;
    status_pesanan: string;
};

export default function KelolaPesananPage() {

    const router = useRouter();
    const [pesanan, setPesanan] = useState<Pesanan[]>([]);
    const [daftarPaket, setDaftarPaket] = useState<PaketFilter[]>([]);
    const [selectedPaket, setSelectedPaket] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    // state sementara
    const [tempPaket, setTempPaket] = useState(selectedPaket);
    const [tempStatus, setTempStatus] = useState(selectedStatus);

    const totalUangMasuk = pesanan.reduce(
        (total, item) => total + item.total_dibayar,
        0
    );

    const getPesanan = async (paketId = "", status = "") => {
        try {
            const params = new URLSearchParams();

            if (paketId) {
                params.append("paket", paketId);
            }

            if (status) {
                params.append("status", status);
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan?${params.toString()}`;

            const res = await fetch(url);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal mengambil data pesanan"
                );
            }

            setPesanan(data);

        } catch (error) {
            console.error(error);
        }
    };

    const getDaftarPaket = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pesanan/paket`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal mengambil daftar paket"
                );
            }

            setDaftarPaket(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDaftarPaket();
    }, []);

    useEffect(() => {
        getPesanan(selectedPaket, selectedStatus);
    }, [selectedPaket, selectedStatus]);

    const tableData = pesanan.map((item, index) => [
        index + 1,

        item.nama,

        item.nama_paket,

        `Rp ${item.harga_paket.toLocaleString("id-ID")}`,

        `Rp ${item.total_dibayar.toLocaleString("id-ID")}`,

        `Rp ${item.sisa_tagihan.toLocaleString("id-ID")}`,

        <StatusBadge
            key={item.id}
            status={item.status_pesanan}
        />,

        <Button
            key={item.id}
            label="Detail"
            radius="oval"
            onClick={() =>
                router.push(`/admin/kelola-pesanan/${item.id}`)
            }
        />,
    ]);

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="flex justify-between items-start pl-2 pr-4 mb-2">
                <h1 className="text-2xl font-bold">
                    Data Pesanan
                </h1>

                <div className="flex items-center gap-4 mt-2">
                        <p className="text-xs font-semibold text-gray-500">
                            Total Uang Masuk :
                        </p>

                        <h2 className="text-sm font-bold text-green-600">
                            Rp {totalUangMasuk.toLocaleString("id-ID")}
                        </h2>
                </div>

                <div className="relative">
                    <Button
                        label="Filter"
                        radius="oval"
                        onClick={() => setShowFilter(!showFilter)}
                    />

                    {showFilter && (
                        <Card
                            bgColor="white"
                            outline="none"
                            className="absolute right-0 mt-2 w-65 z-50 !p-5"
                        >
                            <p className="font-semibold mb-2">
                                Paket
                            </p>
                            <select
                                value={tempPaket}
                                onChange={(e) => setTempPaket(e.target.value)}
                                className="
                                    w-full
                                    border
                                    border-primary
                                    rounded-lg
                                    px-2
                                    py-2
                                    bg-white
                                    text-secondary
                                    focus:outline-none
                                    focus:border-primary
                                    cursor-pointer
                                "
                            >
                                <option value="">Semua Paket</option>

                                {daftarPaket.map((paket) => (
                                    <option key={paket.id} value={paket.id}>
                                        {paket.nama_paket}
                                    </option>
                                ))}
                            </select>

                            <p className="font-semibold mt-4 mb-2">
                                Status
                            </p>
                            <select
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                                className="
                                    w-full
                                    border
                                    border-primary
                                    rounded-lg
                                    px-2
                                    py-2
                                    bg-white
                                    text-secondary
                                    focus:outline-none
                                    focus:border-primary
                                    cursor-pointer
                                "
                            >
                                <option value="">Semua Status</option>
                                <option value="menunggu_pembayaran">
                                    Menunggu Pembayaran
                                </option>
                                <option value="dalam_cicilan">
                                    Dalam Cicilan
                                </option>
                                <option value="lunas">
                                    Lunas
                                </option>
                            </select>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    label="Terapkan"
                                    onClick={() => {
                                        setSelectedPaket(tempPaket);
                                        setSelectedStatus(tempStatus);
                                        setShowFilter(false);
                                    }}
                                />

                                <Button
                                    label="Reset"
                                    variant="outline"
                                    onClick={() => {
                                        setTempPaket("");
                                        setTempStatus("");
                                        setSelectedPaket("");
                                        setSelectedStatus("");
                                        setShowFilter(false);
                                    }}
                                />
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Table
                headers={[
                    "No",
                    "Nama Jamaah",
                    "Nama Paket",
                    "Harga Paket",
                    "Terbayar",
                    "Sisa Tagihan",
                    "Status",
                    "Aksi",
                ]}
                data={tableData}
            />
        </section>
    );
}