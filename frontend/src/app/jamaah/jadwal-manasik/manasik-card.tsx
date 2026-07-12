"use client";

import Card from "@/src/components/atoms/card.component";
import {
    Calendar,
    Clock3,
    MapPin,
    BookOpen,
    User,
    ScrollText,
} from "lucide-react";

type Props = {
    data: {
        nama_paket: string;
        jadwal_keberangkatan: string;
        tanggal_acara: string;
        lokasi_acara: string;
        waktu_acara: string;
        pemateri: string;
        keterangan: string;
    };
};

const formatTanggal = (tanggal: string) =>
    new Date(tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

export default function ManasikCard({ data }: Props) {
    return (
        <Card
            bgColor="white"
            outline="none"
            className="!p-6 shadow-md"
        >
            <h2 className="font-bold text-primary text-lg">
                {data.nama_paket}
            </h2>

            <p className="italic font-semibold mb-5">
                Keberangkatan {formatTanggal(data.jadwal_keberangkatan)}
            </p>

            <div className="space-y-3 text-secondary">
                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <BookOpen size={16} color="gold " />
                    <span className="font-semibold">Agenda</span>
                    <span>: Manasik</span>
                </div>

                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <Calendar size={16} color="gold " />
                    <span className="font-semibold">Tanggal Acara</span>
                    <span>: {formatTanggal(data.tanggal_acara)}</span>
                </div>

                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <MapPin size={16} color="gold " />
                    <span className="font-semibold">Lokasi Acara</span>
                    <span>: {data.lokasi_acara}</span>
                </div>

                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <Clock3 size={16} color="gold " />
                    <span className="font-semibold">Waktu Acara</span>
                    <span>: {data.waktu_acara}</span>
                </div>

                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <User size={16} color="gold " />
                    <span className="font-semibold">Pemateri</span>
                    <span>: {data.pemateri}</span>
                </div>

                <div className="grid grid-cols-[24px_150px_1fr] items-start">
                    <ScrollText size={16} color="gold " />
                    <span className="font-semibold">Keterangan</span>
                    <span>: {data.keterangan}</span>
                </div>
            </div>
        </Card>
    );
}