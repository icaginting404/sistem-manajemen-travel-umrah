"use client";

import Button from "@/src/components/atoms/button.component";
import { UserCheck, Calendar, CheckCircle, Clock3, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PaketUmrah = {
  id: number;
  nama_paket: string;
  jadwal_keberangkatan: string;
  harga: number;
  durasi_perjalanan: string;
  hotel: string;
  total_kuota: number;
  jumlah_peserta: number;
  kuota_tersedia: number;
  maskapai: string;
  status_paket: string;
  flyer: string;
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
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const PaketCard = ({ item }: { item: PaketUmrah }) => {
  const router = useRouter();

  const detailRows = [
    {
      icon: Calendar,
      label: "Jadwal Keberangkatan",
      value: formatTanggal(item.jadwal_keberangkatan),
    },
    {
      icon: Clock3,
      label: "Durasi Perjalanan",
      value: item.durasi_perjalanan,
    },
    {
      icon: Users,
      label: "Total Kuota",
      value: `${item.total_kuota} pax`,
    },
    {
      icon: UserCheck,
      label: "Kuota Tersedia",
      value: `${item.kuota_tersedia} pax`,
    },
    {
      icon: CheckCircle,
      label: "Status Paket",
      value: formatStatusPaket(item.status_paket),
    },
  ];

  return (
    <div className="bg-sab-bg-gray rounded-2xl mx-3 shadow-md overflow-hidden">
      <div className="w-full h-46 bg-gray-300 overflow-hidden">
        {item.flyer ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.flyer}`}
            alt={item.nama_paket}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Tidak ada flyer
          </div>
        )}
      </div>

      {/*Harga strip kuning*/}
      <div className="mx-8 -mt-5 relative z-10 bg-primary/90 rounded-2xl px-5 py-2 flex items-center justify-between">
        <span className="text-sm font-bold text-secondary">
          {formatRupiah(item.harga)}
        </span>
        <span className="text-xs font-semibold text-secondary">
          /pax Quad
        </span>
      </div>

      {/*Nama paket*/}
      <div className="px-4 pt-3">
        <p className="text-sm font-bold text-secondary leading-snug">
          {item.nama_paket}
        </p>
      </div>

      {/*Detail rows*/}
      <div className="flex flex-col rounded-2xl gap-2 px-4 py-2">
        <div className="flex flex-col gap-3">
          {detailRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <Icon size={14} className="text-secondary flex-shrink-0" />
              <span className="text-gray-500 flex-1 min-w-0">{label}</span>
              <span className="font-semibold text-secondary text-right">
                {value || "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/*Tombol*/}
      <div className="px-4 pb-4 pt-2 mt-auto">
        <Button
          label="Lihat Detail"
          color="primary"
          variant="contained"
          radius="oval"
          className="w-full justify-center"
          onClick={() =>
          router.push(`/paket-umrah/${item.id}`)
          }
        />
      </div>
    </div>
  );
};

//Page
const PaketUmrahPage = () => {
  const [paket, setPaket]   = useState<PaketUmrah[]>([]);
  const [search, setSearch] = useState("");

  // GET DATA
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (Array.isArray(data)) setPaket(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const filteredPaket = paket.filter((item) =>
    item.nama_paket.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-sab-bg-gray">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-9 pt-6">
        <div className="bg-secondary text-primary px-5 py-2 rounded-r-xl">
          <h1 className="font-bold text-xl">Paket Umrah</h1>
        </div>

        <div className="relative w-full mr-6 md:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari Paket Umrah"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white
            pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/*Grid*/}
      {filteredPaket.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Search size={36} />
          <p className="text-sm">Paket tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-4 px-3">
          {filteredPaket.map((item) => (
            <PaketCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PaketUmrahPage;