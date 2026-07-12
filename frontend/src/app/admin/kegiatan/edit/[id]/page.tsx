"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Input from "@/src/components/atoms/text-input.component";
import Modal from "@/src/components/atoms/modal.component";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const EditKegiatanPage = () => {
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams();
  const paketId = searchParams.get("paketId");

  const [formData, setFormData] = useState({
    tanggal: "",
    status: "",
    nama: "",
    lokasi: "",
  });

  // GET DETAIL KEGIATAN
  
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/kegiatan/detail/${params.id}`,
        );

        const data = await response.json();

        setFormData({
          tanggal: data.tanggal,
          status: "",
          nama: data.nama,
          lokasi: data.lokasi,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getDetail();
  }, [params.id]);

  // UPDATE KEGIATAN
  const editKegiatan = async () => {
    try {
      const payload = {
        tanggal: formData.tanggal,
        nama: formData.nama,
        lokasi: formData.lokasi,
      };

      console.log("Payload:", payload);

      const response = await fetch(
        `http://localhost:5000/kegiatan/detail/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("Status:", response.status);
      const result = await response.json();

      console.log("Response:", result);

      if (response.ok) {
        router.push(`/admin/kegiatan?paketId=${paketId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => router.push("/admin/kegiatan")}>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-secondary">Edit Kegiatan</h1>

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
          label="Nama Kegiatan"
          variant="primary"
          value={formData.nama}
          onChange={(e) =>
            setFormData({
              ...formData,
              nama: e.target.value,
            })
          }
        />

        <Input
          label="Lokasi"
          variant="primary"
          value={formData.lokasi}
          onChange={(e) =>
            setFormData({
              ...formData,
              lokasi: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() => router.push(`/admin/kegiatan?paketId=${paketId}`)}
          />

          <Button
            color="primary"
            label="Simpan"
            variant="contained"
            onClick={editKegiatan}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditKegiatanPage;
