"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/atoms/modal.component";
import Input from "@/src/components/atoms/text-input.component";
import Button from "@/src/components/atoms/button.component";

const TambahPetugasPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nomor_hp: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !formData.nama ||
      !formData.email ||
      !formData.nomor_hp ||
      !formData.password ||
      !formData.konfirmasiPassword
    ) {
      alert("Semua data wajib diisi");
      return;
    }

    if (formData.password !== formData.konfirmasiPassword) {
      alert("Konfirmasi password tidak sesuai");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/petugas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          nomor_hp: formData.nomor_hp,
          password: formData.password,
        }),
      });

      const result = await response.json();

      alert(result.message);

      router.push("/admin/kelola-petugas");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan petugas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Modal isOpen={true} onClose={() => {}}>
        <h1 className="text-2xl font-bold text-secondary mb-5">
          Tambah Petugas
        </h1>

        <div className="flex flex-col gap-4">
          <Input
            label="Nama Lengkap"
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
            label="Email"
            variant="primary"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            label="Nomor HP"
            variant="primary"
            value={formData.nomor_hp}
            onChange={(e) =>
              setFormData({
                ...formData,
                nomor_hp: e.target.value,
              })
            }
          />

          <Input
            label="Password"
            variant="primary"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <Input
            label="Konfirmasi Password"
            variant="primary"
            type="password"
            value={formData.konfirmasiPassword}
            onChange={(e) =>
              setFormData({
                ...formData,
                konfirmasiPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button
            label="Batal"
            color="secondary"
            variant="contained"
            onClick={() => router.push("/admin/kelola-petugas")}
          />

          <Button
            label={loading ? "Menyimpan..." : "Simpan"}
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          />
        </div>
      </Modal>
    </section>
  );
};

export default TambahPetugasPage;
