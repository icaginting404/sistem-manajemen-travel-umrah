"use client";

import Button from "@/src/components/atoms/button.component";
import Card from "@/src/components/atoms/card.component";
import Chip from "@/src/components/atoms/chip.component";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { Calendar, Circle, Edit, MapPin, Plus, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

type PaketUmrah = {
  id: number;
  nama_paket: string;
};

type DetailKegiatan = {
  id: number;
  nama: string;
  lokasi: string;
  dokumentasi: string | null;
};

type Kegiatan = {
  id: number;
  paket_id: number;
  tanggal: string;
  kegiatan: DetailKegiatan[];
};

type ApiKegiatan = Kegiatan;

const getStatus = (tanggal: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(tanggal);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate > today) return "Belum Dimulai";
  if (eventDate < today) return "Selesai";

  return "Sedang Berlangsung";
};

const HalamanKegiatan = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const paketIdFromUrl = searchParams.get("paketId") ?? "";
  const [dataKegiatan, setDataKegiatan] = useState<Kegiatan[]>([]);
  const [paketUmrah, setPaketUmrah] = useState<PaketUmrah[]>([]);
  const [selectedPaket, setSelectedPaket] = useState(paketIdFromUrl);

  const handlePaketChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    setSelectedPaket(value);

    route.replace(`/admin/kegiatan?paketId=${value}`);
  };

  // GET DATA
  useEffect(() => {
    const getKegiatan = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kegiatan?paket_id=${selectedPaket}`,
        );

        const data = await response.json();

        setDataKegiatan(data);
      } catch (error) {
        console.log(error);
      }
    };

    getKegiatan();
  }, [selectedPaket]);

  // GET DATA PAKET UMRAH
  useEffect(() => {
    const getPaketUmrah = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`);

        const data = await response.json();
        console.log(data);

        setPaketUmrah(data);
      } catch (error) {
        console.log(error);
      }
    };

    getPaketUmrah();
  }, []);

  //DELETE
  const deleteCard = async (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus seluruh kegiatan ini?",
    );
    if (!confirmDelete) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kegiatan/${id}`, {
        method: "DELETE",
      });

      setDataKegiatan((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDetailKegiatan = async (detailId: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus kegiatan ini?",
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kegiatan/detail/${detailId}`, {
        method: "DELETE",
      });

      // Refresh data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kegiatan?paket_id=${selectedPaket}`,
      );

      const data = await response.json();
      setDataKegiatan(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredKegiatan = dataKegiatan.filter(
    (item) => item.paket_id === Number(selectedPaket),
  );

  return (
    <section className="bg-sab-bg-gray min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daftar Kegiatan</h1>
        </div>
        <FormControl size="small">
          <Select
            displayEmpty
            value={selectedPaket}
            onChange={handlePaketChange}
            renderValue={(selected) => {
              if (!selected) return "Pilih Paket Umrah";

              const paket = paketUmrah.find(
                (item) => String(item.id) === selected,
              );

              return paket?.nama_paket || "Pilih Paket Umrah";
            }}
            sx={{
              minWidth: 280,
              bgcolor: "var(--color-primary)",
              color: "white",
              borderRadius: "12px",
              fontWeight: 600,

              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },

              ".MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            {paketUmrah.map((paket) => (
              <MenuItem key={paket.id} value={String(paket.id)}>
                {paket.nama_paket}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedPaket && (
          <Button
            color="primary"
            label="Tambah"
            variant="contained"
            prefix={<Plus size={18} />}
            onClick={() =>
              route.push(`/admin/kegiatan/add?paketId=${selectedPaket}`)
            }
          />
        )}
      </div>

      {/* LIST CARD */}
      {!selectedPaket ? (
        <div className="flex justify-center mt-8">
          <Card
            bgColor="white"
            outline="primary"
            className="p-12 max-w-4xl w-full "
          >
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <Calendar size={36} className="text-primary" />

              <h2 className="text-lg font-semibold text-secondary">
                Pilih Paket Umrah
              </h2>

              <p className="text-gray-500">
                Silakan pilih paket umrah terlebih dahulu untuk menambahkan dan
                melihat itinerary kegiatan.
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-8 items-center">
          {filteredKegiatan.map((item, index) => (
            <div key={item.id} className="relative w-full mx-4">
              {/* NUMBER */}
              <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full font-bold bg-primary text-2xl shadow-sm">
                {index + 1}
              </div>

              <Card bgColor="white" outline="primary" className="flex-1 p-6">
                <div className="flex flex-col gap-5 text-secondary">
                  {/* HEADER */}
                  <div className="flex flex-wrap items-start justify-between w-full gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} />

                        <span className="font-medium">
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

                    <div className="flex items-center gap-3">
                      <Chip
                        color="primary"
                        label={item.kegiatan[0]?.lokasi}
                        leftIcon={<MapPin size={18} />}
                        radius="full"
                      />

                      <Button
                        color="secondary"
                        label={<X size={20} />}
                        variant="text"
                        onClick={() => deleteCard(item.id)}
                      />
                    </div>
                  </div>

                  {/* LIST KEGIATAN */}
                  <div className="flex flex-col gap-4">
                    {item.kegiatan.map((kegiatanItem, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <Circle size={10} />

                          <span className="font-medium">
                            {kegiatanItem.nama}
                          </span>
                        </div>

                        <span className="text-sm text-gray-500">
                          {kegiatanItem.lokasi}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            color="secondary"
                            label={<Edit size={20} />}
                            variant="text"
                            onClick={() =>
                              route.push(
                                `/admin/kegiatan/edit/${kegiatanItem.id}?paketId=${selectedPaket}`,
                              )
                            }
                          />

                          <Button
                            color="secondary"
                            label={<Trash2 size={20} />}
                            variant="text"
                            onClick={() =>
                              deleteDetailKegiatan(kegiatanItem.id)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HalamanKegiatan;
