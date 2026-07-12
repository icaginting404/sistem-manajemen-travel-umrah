"use client";

import Button from "@/src/components/atoms/button.component";
import InfoRow from "@/src/components/atoms/info-row.component";
import Modal from "@/src/components/atoms/modal.component";
import { useToast } from "@/src/context/toast.context";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type DetailBiayaOperasional = {
  id: number;
  paket_umrah_id: number;
  nama_paket: string;
  tanggal: string;
  keterangan: string;
  nominal: number;
  dibayar_oleh: "admin" | "petugas";
  bukti: string | null;
};

export default function DetailBiayaOperasionalPetugasPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const paketId = searchParams.get("paketId");

  const [detail, setDetail] = useState<DetailBiayaOperasional | null>(null);
  const [openImage, setOpenImage] = useState(false);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${params.id}`,
        );

        const data = await response.json();

        setDetail(data);
      } catch (err) {
        console.log(err);
        toast.error("Gagal mengambil data.");
      }
    };

    getDetail();
  }, [params.id, toast]);

  const formatTanggal = (tanggal: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(tanggal));
  };

  const formatRupiah = (nominal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

  const hapusBiayaOperasional = async () => {
    const yakin = window.confirm(
      "Apakah Anda yakin ingin menghapus biaya operasional ini?",
    );

    if (!yakin) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${detail?.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setTimeout(() => {
        router.push(
          `/petugas/biaya-operasional?paketId=${
            paketId ?? detail?.paket_umrah_id
          }`,
        );
      }, 700);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menghapus data.");
    }
  };

  if (!detail) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        Loading...
      </section>
    );
  }

  return (
    <section className="p-8 bg-sab-bg-gray min-h-screen">
      <Modal isOpen={true} onClose={() => {}}>
        <div
          className="flex items-center gap-3 cursor-pointer mb-5"
          onClick={() =>
            router.push(
              `/petugas/biaya-operasional?paketId=${
                paketId ?? detail.paket_umrah_id
              }`,
            )
          }
        >
          <ArrowLeft size={20} />
          <h1 className="text-xl font-bold text-secondary">
            Detail Biaya Operasional
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <InfoRow label="Nama Paket" value={detail.nama_paket} />

          <InfoRow label="Tanggal" value={formatTanggal(detail.tanggal)} />

          <InfoRow label="Keterangan" value={detail.keterangan} />

          <InfoRow label="Nominal" value={formatRupiah(detail.nominal)} />

          <InfoRow
            label="Dibayar Oleh"
            value={detail.dibayar_oleh === "admin" ? "Admin" : "Petugas"}
          />

          <InfoRow
            label="Bukti"
            value={
              detail.bukti ? (
                <div className="w-20">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/biaya-operasional/${detail.bukti}`}
                    alt="Bukti"
                    className="rounded-lg border cursor-pointer hover:scale-150 transition"
                    onClick={() => setOpenImage(true)}
                  />
                </div>
              ) : (
                "-"
              )
            }
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button
            label="Edit"
            onClick={() =>
              router.push(
                `/petugas/biaya-operasional/edit/${detail.id}?paketId=${
                  paketId ?? detail.paket_umrah_id
                }`,
              )
            }
          />

          <Button
            label="Hapus"
            color="danger"
            onClick={hapusBiayaOperasional}
          />
        </div>
      </Modal>

      <Modal
        isOpen={openImage}
        onClose={() => setOpenImage(false)}
        className="max-w-lg"
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/biaya-operasional/${detail.bukti}`}
          className="rounded-lg"
          alt="Bukti"
        />
      </Modal>
    </section>
  );
}
