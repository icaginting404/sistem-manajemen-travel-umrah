"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import { useToast } from "@/src/context/toast.context";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

type DetailBiayaOperasional = {
  id: number;
  paket_umrah_id: number;
  nama_paket: string;
  tanggal: string;
  keterangan: string;
  nominal: number;
  bukti: string | null;
};

export default function EditBiayaOperasionalPetugasPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const paketId = searchParams.get("paketId");

  const [loading, setLoading] = useState(false);

  const [detail, setDetail] = useState<DetailBiayaOperasional | null>(null);

  const [formData, setFormData] = useState({
    tanggal: "",
    keterangan: "",
    nominal: "",
  });

  const [bukti, setBukti] = useState<File | null>(null);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${params.id}`,
        );

        const data = await response.json();

        setDetail(data);

        setFormData({
          tanggal: data.tanggal.slice(0, 10),
          keterangan: data.keterangan,
          nominal: String(data.nominal),
        });
      } catch (err) {
        console.log(err);
        toast.error("Gagal mengambil data.");
      }
    };

    getDetail();
  }, [params.id, toast]);

  const handleSubmit = async () => {
    if (!formData.tanggal || !formData.keterangan || !formData.nominal) {
      toast.warning("Semua data harus diisi.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("tanggal", formData.tanggal);
      data.append("keterangan", formData.keterangan);
      data.append("nominal", formData.nominal);

      if (bukti) {
        data.append("bukti", bukti);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${params.id}`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setTimeout(() => {
        router.push(
          `/petugas/biaya-operasional/detail/${params.id}?paketId=${
            paketId ?? detail?.paket_umrah_id
          }`,
        );
      }, 700);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Gagal mengubah data.");
    }
  };

  if (!detail) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        Loading...
      </section>
    );
  }

  return (
    <section>
      <Modal isOpen={true} onClose={() => {}}>
        <h1 className="mb-5 text-xl font-bold text-secondary">
          Edit Biaya Operasional
        </h1>

        <div className="flex flex-col gap-3">
          <Input
            label="Nama Paket Umrah"
            value={detail.nama_paket}
            variant="primary"
            disabled
          />

          <DateInput
            label="Tanggal"
            value={formData.tanggal ? dayjs(formData.tanggal) : null}
            onChange={(value) =>
              setFormData({
                ...formData,
                tanggal: value ? value.format("YYYY-MM-DD") : "",
              })
            }
          />

          <Input
            label="Keterangan"
            variant="primary"
            value={formData.keterangan}
            onChange={(e) =>
              setFormData({
                ...formData,
                keterangan: e.target.value,
              })
            }
          />

          <Input
            label="Nominal"
            variant="primary"
            type="number"
            value={formData.nominal}
            onChange={(e) =>
              setFormData({
                ...formData,
                nominal: e.target.value,
              })
            }
          />

          <Input
            label="Ganti Bukti (Opsional)"
            variant="primary"
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setBukti(e.target.files[0]);
              }
            }}
          />

          {detail.bukti && (
            <div>
              <p className="mb-2 text-sm font-medium">Bukti Saat Ini</p>

              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/biaya-operasional/${detail.bukti}`}
                className="w-28 rounded-lg border"
                alt="Bukti"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() =>
              router.push(
                `/petugas/biaya-operasional/detail/${params.id}?paketId=${
                  paketId ?? detail.paket_umrah_id
                }`,
              )
            }
          />

          <Button
            color="primary"
            variant="contained"
            label={loading ? "Menyimpan..." : "Simpan"}
            onClick={handleSubmit}
          />
        </div>
      </Modal>
    </section>
  );
}
