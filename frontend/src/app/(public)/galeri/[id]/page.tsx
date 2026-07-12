"use client";

import { useParams } from "next/navigation";
import { Calendar, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

type GaleriDetail = {
  id: number;
  nama_paket: string;
  dokumentasi: {
    id: number;
    nama: string;
    lokasi: string;
    tanggal: string;
    dokumentasi: string;
  }[];
};

export default function GaleriDetailPage() {
  const { id } = useParams();
  const [galeri, setGaleri] = useState<GaleriDetail | null>(null);

  useEffect(() => {
    const getGaleriDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/kegiatan/galeri/${id}`,
        );

        const data = await response.json();

        setGaleri(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getGaleriDetail();
    }
  }, [id]);

  if (!galeri) {
    return <div className="p-8 text-center">Memuat galeri...</div>;
  }

  return (
    <section className="min-h-screen bg-sab-bg-gray p-6">
  <div className="max-w-6xl mx-auto">

    <h1 className="text-3xl font-bold mb-2">
      {galeri.nama_paket}
    </h1>

    <div className="flex gap-6 text-gray-500 mb-8">

      <div className="flex items-center gap-2">
        <ImageIcon size={18} />
        {galeri.dokumentasi.length} Dokumentasi
      </div>

      <div className="flex items-center gap-2">
        <Calendar size={18} />
        {
          new Set(
            galeri.dokumentasi.map((item) => item.tanggal)
          ).size
        } Hari
      </div>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {galeri.dokumentasi.map((item) => (

        <div
          key={item.id}
          className="bg-white rounded-xl shadow overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`http://localhost:5000/uploads/dokumentasi/${item.dokumentasi}`}
            alt={item.nama}
            className="w-full h-60 object-cover"
          />

          <div className="p-4">

            <h2 className="font-semibold text-lg">
              {item.nama}
            </h2>

            <p className="text-gray-500">
              {item.lokasi}
            </p>

            <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
              <Calendar size={16} />
              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>

          </div>
        </div>

      ))}

    </div>

  </div>
</section>
  );
}
