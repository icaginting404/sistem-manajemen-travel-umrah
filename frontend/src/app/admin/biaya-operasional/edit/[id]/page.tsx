"use client";

import Button from "@/src/components/atoms/button.component";
import DateInput from "@/src/components/atoms/date-input.component";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import SelectInput from "@/src/components/atoms/select-input.component";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const EditBiayaOperasionalPage = () => {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [namaPaket, setNamaPaket] = useState("");
  const [bukti, setBukti] = useState<File | null>(null);
  const [buktiLama, setBuktiLama] = useState("");

  const [formData, setFormData] = useState({
    tanggal: "",
    keterangan: "",
    nominal: "",
    dibayar_oleh: "admin",
  });

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${id}`,
        );

        const data = await response.json();
        console.log("Detail Biaya Operasional:", data);

        setNamaPaket(data.nama_paket);

        setFormData({
          tanggal: dayjs(data.tanggal).format("YYYY-MM-DD"),
          keterangan: data.keterangan,
          nominal: String(data.nominal),
          dibayar_oleh: data.dibayar_oleh,
        });

        setBuktiLama(data.bukti_admin ?? data.bukti_petugas ?? "");
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getDetail();
    }
  }, [id]);

  const editBiayaOperasional = async () => {
    try {
      const data = new FormData();

      data.append("tanggal", formData.tanggal);
      data.append("keterangan", formData.keterangan);
      data.append("nominal", formData.nominal);

      if (bukti) {
        data.append("bukti", bukti);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/biaya-operasional/${id}`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await response.json();

      alert(result.message);

      if (response.ok) {
        router.push("/admin/biaya-operasional");
      }
    } catch (error) {
      console.log(error);
      alert("Gagal mengubah biaya operasional");
    }
  };

  return (
    <section>
      <Modal
        isOpen={true}
        onClose={() => router.push("/admin/biaya-operasional")}
      >
        <h1 className="text-xl font-bold mb-4 text-secondary">
          Edit Biaya Operasional
        </h1>

        <div className="flex flex-col gap-3 text-secondary">
          <Input
            label="Nama Paket Umrah"
            variant="primary"
            value={namaPaket}
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
            label={
              formData.dibayar_oleh === "admin"
                ? "Bukti Pembayaran Baru (Opsional)"
                : "Bukti Transfer Baru (Opsional)"
            }
            variant="primary"
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setBukti(e.target.files[0]);
              }
            }}
          />

          {/* Preview Bukti Lama */}
          {buktiLama && !bukti && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Bukti saat ini</p>

              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/biaya-operasional/${buktiLama}`}
                alt="Bukti"
                className="w-24 rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            </div>
          )}

          {/* Preview Bukti Baru */}
          {bukti && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Preview bukti baru</p>

              <img
                src={URL.createObjectURL(bukti)}
                alt="Preview"
                className="w-24 rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-10">
          <Button
            color="secondary"
            label="Batal"
            variant="contained"
            onClick={() => router.push("/admin/biaya-operasional")}
          />

          <Button
            color="primary"
            label="Simpan Perubahan"
            variant="contained"
            onClick={editBiayaOperasional}
          />
        </div>
      </Modal>
    </section>
  );
};

export default EditBiayaOperasionalPage;
