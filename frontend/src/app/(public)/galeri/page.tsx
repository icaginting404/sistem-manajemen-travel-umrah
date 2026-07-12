"use client";

import Card from "@/src/components/atoms/card.component";
import { Calendar, ChevronRight, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Galeri = {
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

export default function GaleriPage() {
  const router = useRouter();

  const [galeri, setGaleri] = useState<Galeri[]>([]);

  useEffect(() => {
    const getGaleri = async () => {
      try {
        const response = await fetch("http://localhost:5000/kegiatan/galeri");

        const data = await response.json();

        setGaleri(data);
      } catch (error) {
        console.log(error);
      }
    };

    getGaleri();
  }, []);

  return (
    <section className="min-h-screen bg-sab-bg-gray p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Galeri Dokumentasi</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((item) => (
            <Card
              key={item.id}
              bgColor="white"
              outline="primary"
              className="overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/galeri/${item.id}`)}
            >
              <img
                src={`http://localhost:5000/uploads/dokumentasi/${item.dokumentasi[0]?.dokumentasi}`}
                alt={item.nama_paket}
                className="h-56 w-full object-cover"
                width={800}
                height={500}
              />
              <div className="p-4">
                <h2 className="font-bold text-lg">{item.nama_paket}</h2>

                <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    {item.dokumentasi.length} Foto
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {item.dokumentasi.length} Dokumentasi Hari
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <ChevronRight />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
