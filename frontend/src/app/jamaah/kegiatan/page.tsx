"use client";

import Card from "@/src/components/atoms/card.component";
import { Calendar, Circle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

type DetailKegiatan = {
  id: number;
  nama: string;
  lokasi: string;
  dokumentasi: string | null;
};

type Kegiatan = {
  id: number;
  tanggal: string;
  kegiatan: DetailKegiatan[];
};

type ApiKegiatan = {
  id: number;
  tanggal: string;
  kegiatan: string;
};

const getStatus = (tanggal: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(tanggal);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate > today) return "Belum Dimulai";
  if (eventDate < today) return "Selesai";

  return "Sedang Berlangsung";
};

const JadwalKegiatanJamaahPage = () => {
  const [jadwal, setJadwal] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJadwal = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")!);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jamaah/jadwal/${user.id}`,
        );

        const data = await response.json();

        const parsed = data.map((item: ApiKegiatan) => ({
          ...item,
          kegiatan:
            typeof item.kegiatan === "string"
              ? JSON.parse(item.kegiatan)
              : item.kegiatan,
        }));

        setJadwal(parsed);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getJadwal();
  }, []);

  if (!loading && jadwal.length === 0) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-sab-bg-gray">
        <Card
          bgColor="white"
          outline="primary"
          className="max-w-xl w-full text-center py-16"
        >
          <Calendar size={70} className="mx-auto text-gray-400 mb-4" />

          <h2 className="text-2xl font-bold">Belum Ada Jadwal Kegiatan</h2>

          <p className="text-gray-500 mt-2">
            Jadwal kegiatan akan tersedia setelah Anda memiliki paket umrah.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-sab-bg-gray p-6">
      <div className="max-w-5xl mx-auto">
        <Card bgColor="white" outline="primary">
          <h1 className="text-2xl font-bold">Jadwal Kegiatan Umrah</h1>

          <p className="text-gray-500 mt-2">
            Berikut merupakan rangkaian kegiatan selama perjalanan ibadah umrah
            Anda.
          </p>
        </Card>

        <div className="mt-8 relative">
          {/* Garis Timeline */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-primary/20"></div>

          <div className="flex flex-col gap-6">
            {jadwal.map((item, index) => (
              <div key={item.id} className="relative flex gap-6">
                {/* Nomor Hari */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold shadow">
                  {index + 1}
                </div>

                {/* Card */}
                <Card bgColor="white" outline="primary" className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />

                        <span className="font-semibold">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <span
                        className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-semibold
                ${
                  getStatus(item.tanggal) === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : getStatus(item.tanggal) === "Sedang Berlangsung"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
                      >
                        {getStatus(item.tanggal)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {item.kegiatan.length} Kegiatan
                    </div>
                  </div>

                  <div className="mt-6 ">
                    {item.kegiatan.map((kegiatan) => (
                      <div
                        key={kegiatan.id}
                        className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-none last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-2 h-2.5 w-2.5 rounded-full bg-primary"></div>

                          <div>
                            <h3 className="font-medium text-secondary">
                              {kegiatan.nama}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <MapPin size={15} />

                              {kegiatan.lokasi}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JadwalKegiatanJamaahPage;
