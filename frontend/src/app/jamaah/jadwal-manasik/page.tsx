"use client";

import { useEffect, useState } from "react";
import ManasikCard from "./manasik-card";
import Card from "@/src/components/atoms/card.component";

type Jadwal = {
    id: number;
    nama_paket: string;
    jadwal_keberangkatan: string;
    tanggal_acara: string;
    lokasi_acara: string;
    waktu_acara: string;
    pemateri: string;
    keterangan: string;
};

export default function JadwalManasikPage() {

    const [jadwal, setJadwal] = useState<Jadwal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/jadwal-manasik/user/${user.id}`
                );

                const data = await res.json();

                setJadwal(data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="p-6">
                Loading...
            </section>
        );
    }

    const hariIni = new Date();

    const upcoming = jadwal.filter(
        item => new Date(item.tanggal_acara) >= hariIni
    );

    const history = jadwal.filter(
        item => new Date(item.tanggal_acara) < hariIni
    );

    return (
        <section className="bg-sab-bg-gray min-h-screen py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Jadwal Manasik
                </h1>

                <div className="mb-10">
                    <h2 className="font-bold text-lg mb-4">
                        Segera Datang
                    </h2>

                    <div className="space-y-5">
                        {upcoming.length === 0 ? (
                            <Card className="!p-6 shadow-md">
                                <p className="text-gray-500 text-center">
                                    Belum ada jadwal
                                </p>
                            </Card>
                        ) : (
                            upcoming.map(item => (
                                <ManasikCard
                                    key={item.id}
                                    data={item}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="font-bold text-lg mb-4">
                        Riwayat Manasik
                    </h2>

                    <div className="space-y-5">
                        {history.length === 0 ? (
                            <Card className="!p-6 shadow-md">
                                <p className="text-gray-500 text-center">
                                    Belum ada riwayat
                                </p>
                            </Card>
                        ) : (
                            history.map(item => (
                                <ManasikCard
                                    key={item.id}
                                    data={item}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}