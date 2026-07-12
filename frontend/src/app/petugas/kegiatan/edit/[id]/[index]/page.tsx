"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Input from "@/src/components/atoms/text-input.component";
import Modal from "@/src/components/atoms/modal.component";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

type DetailKegiatan = {
  nama: string;
  lokasi: string;
};

const EditKegiatanPage = () => {
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    tanggal: "",
    status: "",
    nama: "",
    lokasi: "",
  });

  const [allKegiatan, setAllKegiatan] = useState<DetailKegiatan[]>([]);
  // GET DETAIL
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/kegiatan/${params.id}`,
        );

        const data = await response.json();

        const kegiatan =
          typeof data.kegiatan === "string"
            ? JSON.parse(data.kegiatan)
            : data.kegiatan;

        setAllKegiatan(kegiatan);

        const selectedKegiatan = kegiatan[Number(params.index)];
        setFormData({
          tanggal: data.tanggal,
          status: data.status,
          nama: selectedKegiatan?.nama || "",
          lokasi: selectedKegiatan?.lokasi || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    getDetail();
  }, [params.id]);

  // UPDATE
  const editKegiatan = async () => {
    try {
      const updatedKegiatan = [...allKegiatan];

      updatedKegiatan[Number(params.index)] = {
        nama: formData.nama,
        lokasi: formData.lokasi,
      };

      const payload = {
        tanggal: formData.tanggal,
        status: formData.status,
        kegiatan: updatedKegiatan,
      };

      await fetch(`http://localhost:5000/kegiatan/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      router.push("/petugas/kegiatan");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => router.push("/petugas/kegiatan")}>
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
            onClick={() => router.push("/petugas/kegiatan")}
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
