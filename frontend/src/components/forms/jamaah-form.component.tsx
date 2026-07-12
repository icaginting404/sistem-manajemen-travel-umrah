"use client";
import { useState, useEffect } from "react";
import Card from "@/src/components/atoms/card.component";
import Input from "@/src/components/atoms/text-input.component";
import Button from "@/src/components/atoms/button.component";
import { Upload, X, Plus, FileText } from "lucide-react";
import Chip from "@/src/components/atoms/chip.component";
import { useRouter } from "next/navigation";
import ToastComponent from "@/src/components/atoms/toast.component";
import useToast from "@/src/hooks/use-toast";

type KontakDarurat = {
    nama_lengkap: string;
    alamat: string;
    hubungan: string;
    nomor_hp: string;
    urutan: number;
};

type Berkas = {
    jenis_berkas: string;
    nama_berkas: string;
    file_path: string;
    file_url: string;
};

type ProfileResponse = {
    email:string;
    nama: string;
    nomor_hp: string;
    nama_tambahan: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nomor_ktp: string;
    nomor_paspor: string;
    tanggal_dikeluarkan_paspor: string;
    tempat_dikeluarkan_paspor: string;
    masa_berlaku_paspor: string;
    jenis_kelamin: string;
    status_perkawinan: string;
    alamat: string;
    kota_kabupaten: string;
    provinsi: string;
    pekerjaan: string;
    kontak_darurat?: KontakDarurat[];
    berkas?: Berkas[];
};

type JamaahFormProps = {
    userId?: number;
    isAdmin?: boolean;
};

export default function JamaahForm({
    userId,
    isAdmin = false,
}: JamaahFormProps) {

    const [formData, setFormData] = useState({
        email: "",
        nama_lengkap: "",
        nama_tambahan: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        nomor_ktp: "",
        nomor_paspor: "",
        tanggal_dikeluarkan_paspor: "",
        tempat_dikeluarkan_paspor: "",
        masa_berlaku_paspor: "",
        jenis_kelamin: "",
        status_perkawinan: "",
        alamat: "",
        kota_kabupaten: "",
        provinsi: "",
        pekerjaan: "",
        no_telp: "",

        kontak1_nama: "",
        kontak1_alamat: "",
        kontak1_hubungan: "",
        kontak1_telp: "",

        kontak2_nama: "",
        kontak2_alamat: "",
        kontak2_hubungan: "",
        kontak2_telp: "",
    });

    const [files, setFiles] = useState({
        paspor: null as File | null,
        buku_nikah: null as File | null,
        buku_vaksin: null as File | null,
        pas_foto: null as File | null,
        akta_lahir: null as File | null,
        lainnya: [] as File[],
    });

    const router = useRouter();
    const { toast, showToast, closeToast } = useToast();
    const [uploadedFiles, setUploadedFiles] = useState<Berkas[]>([]);
    const [deletedFiles, setDeletedFiles] = useState<string[]>([]);

    const handleSubmit = async () => {
        const requiredFields = [
            {
                value: formData.nama_lengkap,
                label: "Nama Lengkap",
            },
            {
                value: formData.tempat_lahir,
                label: "Tempat Lahir",
            },
            {
                value: formData.tanggal_lahir,
                label: "Tanggal Lahir",
            },
            {
                value: formData.nomor_ktp,
                label: "No. KTP",
            },
            {
                value: formData.jenis_kelamin,
                label: "Jenis Kelamin",
            },
            {
                value: formData.status_perkawinan,
                label: "Status Perkawinan",
            },
            {
                value: formData.alamat,
                label: "Alamat",
            },
            {
                value: formData.kota_kabupaten,
                label: "Kota/Kabupaten",
            },
            {
                value: formData.provinsi,
                label: "Provinsi",
            },
            {
                value: formData.no_telp,
                label: "No Telp",
            },
            {
                value: formData.kontak1_nama,
                label: "Nama Kontak Darurat",
            },
            {
                value: formData.kontak1_hubungan,
                label: "Hubungan Kontak Darurat",
            },
            {
                value: formData.kontak1_telp,
                label: "No Telp Kontak Darurat",
            },
        ];

        const emptyField = requiredFields.find(
            (field) => !String(field.value).trim()
        );

        if (emptyField) {
            showToast(
                "Mohon lengkapi seluruh data yang bertanda (*) sebelum menyimpan.",
                "warning"
            );
            return;
        }
        try {
            const currentUserId =
            isAdmin && userId
            ? userId
            : JSON.parse(localStorage.getItem("user") || "{}").id;

            const payload = new FormData();

            // DATA PROFILE
            payload.append("email", formData.email);
            payload.append("nama", formData.nama_lengkap);
            payload.append("nomor_hp", formData.no_telp);
            payload.append("user_id", currentUserId.toString());
            payload.append("nama_tambahan", formData.nama_tambahan);
            payload.append("tempat_lahir", formData.tempat_lahir);
            payload.append("tanggal_lahir", formData.tanggal_lahir);
            payload.append("nomor_ktp", formData.nomor_ktp);
            payload.append("nomor_paspor", formData.nomor_paspor);
            payload.append("tanggal_dikeluarkan_paspor", formData.tanggal_dikeluarkan_paspor);
            payload.append("tempat_dikeluarkan_paspor", formData.tempat_dikeluarkan_paspor);
            payload.append("masa_berlaku_paspor", formData.masa_berlaku_paspor);
            payload.append("jenis_kelamin", formData.jenis_kelamin);
            payload.append("status_perkawinan", formData.status_perkawinan);
            payload.append("alamat", formData.alamat);
            payload.append("kota_kabupaten", formData.kota_kabupaten);
            payload.append("provinsi", formData.provinsi);
            payload.append("pekerjaan", formData.pekerjaan);

            // KONTAK DARURAT 1
            payload.append("kontak1_nama", formData.kontak1_nama);
            payload.append("kontak1_alamat", formData.kontak1_alamat);
            payload.append("kontak1_hubungan", formData.kontak1_hubungan);
            payload.append("kontak1_telp", formData.kontak1_telp);

            // KONTAK DARURAT 2
            payload.append("kontak2_nama", formData.kontak2_nama);
            payload.append("kontak2_alamat", formData.kontak2_alamat);
            payload.append("kontak2_hubungan", formData.kontak2_hubungan);
            payload.append("kontak2_telp", formData.kontak2_telp);

            payload.append("deleted_files", JSON.stringify(deletedFiles)); 

            // FILE
            if (files.paspor) {
                payload.append("paspor", files.paspor);
            }

            if (files.buku_nikah) {
                payload.append("buku_nikah", files.buku_nikah);
            }

            if (files.buku_vaksin) {
                payload.append("buku_vaksin", files.buku_vaksin);
            }

            if (files.pas_foto) {
                payload.append("pas_foto", files.pas_foto);
            }

            if (files.akta_lahir) {
                payload.append("akta_lahir", files.akta_lahir);
            }

            files.lainnya.forEach((file) => {
                payload.append("lainnya", file);
            });

            for (const pair of payload.entries()) {
                console.log(pair[0], pair[1]);
            }
            
            const endpoint =
            isAdmin && userId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/profile`;

            const method =
                isAdmin && userId
                    ? "PUT"
                    : "POST";

            const res = await fetch(endpoint, {
                method,
                body: payload,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Gagal menyimpan profil"
                );
            }

            showToast("Profil berhasil disimpan", "success");

            setTimeout(() => {
                router.back();
            }, 800);

        } catch (error) {

            console.error(error);

            showToast(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan",
                "error"
            );
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof typeof files
    ) => {
        const selected = e.target.files;

        if (!selected) return;

        if (key === "lainnya") {
            setFiles((prev) => ({
                ...prev,
                lainnya: [...prev.lainnya, ...Array.from(selected)],
            }));
            return;
        }

        setFiles((prev) => ({
        ...prev,
        [key]: selected[0],
        }));
    };

    useEffect(() => {
    const loadProfile = async () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const currentUserId =
                isAdmin && userId
                    ? userId
                    : user.id;

            if (!currentUserId) return;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${currentUserId}`
            );

            if (!res.ok) {
                throw new Error("Gagal mengambil profil");
            }

            const data: ProfileResponse = await res.json();

            const formatDate = (date: string) =>
                date ? date.split("T")[0] : "";

            setUploadedFiles(data.berkas || []);

            const kontak1 = data.kontak_darurat?.find(
                (item) => item.urutan === 1
            );

            const kontak2 = data.kontak_darurat?.find(
                (item) => item.urutan === 2
            );

                setFormData({
                    email: data.email || "",
                    nama_lengkap: data.nama || "",
                    nama_tambahan: data.nama_tambahan || "",
                    tempat_lahir: data.tempat_lahir || "",
                    tanggal_lahir:
                    data.tanggal_lahir?.split("T")[0] || "",

                    nomor_ktp: data.nomor_ktp || "",
                    nomor_paspor: data.nomor_paspor || "",

                    tanggal_dikeluarkan_paspor:
                    formatDate(data.tanggal_dikeluarkan_paspor),

                    tempat_dikeluarkan_paspor:
                    data.tempat_dikeluarkan_paspor || "",

                    masa_berlaku_paspor:
                    formatDate(data.masa_berlaku_paspor),

                    jenis_kelamin: data.jenis_kelamin || "",
                    status_perkawinan: data.status_perkawinan || "",

                    alamat: data.alamat || "",
                    kota_kabupaten: data.kota_kabupaten || "",
                    provinsi: data.provinsi || "",

                    pekerjaan: data.pekerjaan || "",

                    no_telp: data.nomor_hp || "",

                    kontak1_nama: kontak1?.nama_lengkap || "",
                    kontak1_alamat: kontak1?.alamat || "",
                    kontak1_hubungan: kontak1?.hubungan || "",
                    kontak1_telp: kontak1?.nomor_hp || "",

                    kontak2_nama: kontak2?.nama_lengkap || "",
                    kontak2_alamat: kontak2?.alamat || "",
                    kontak2_hubungan: kontak2?.hubungan || "",
                    kontak2_telp: kontak2?.nomor_hp || "",
                });

            } catch (error) {
                console.error(error);
            }
        };

        loadProfile();
    }, [userId, isAdmin]);

    const getUploadedFile = (jenis: string) => {
        return uploadedFiles.find(
            (item) => item.jenis_berkas === jenis
        );
    };

    useEffect(() => {
        console.log(uploadedFiles);
    }, [uploadedFiles]);

    return (
        <section className="bg-sab-bg-gray min-h-screen p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                {/* DATA JAMAAH */}
                <Card shadow>
                    <h1 className="text-3xl font-bold text-center mb-8">
                        Data Jamaah
                    </h1>

                    <div className="grid md:grid-cols-2 gap-5">

                        <Input
                            label="Nama Lengkap (Sesuai KTP)"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleChange}
                            required
                        />
                        
                        <Input
                            label="Email"
                            value={formData.email}
                            disabled
                        />

                        <Input
                            label="Nama Tambahan"
                            name="nama_tambahan"
                            value={formData.nama_tambahan}
                            onChange={handleChange}
                        />

                        <Input
                            label="No. Paspor"
                            name="nomor_paspor"
                            value={formData.nomor_paspor}
                            onChange={handleChange}
                        />

                        <Input
                            label="Tanggal Lahir"
                            type="date"
                            name="tanggal_lahir"
                            value={formData.tanggal_lahir}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Tanggal Dikeluarkan Paspor"
                            type="date"
                            name="tanggal_dikeluarkan_paspor"
                            value={formData.tanggal_dikeluarkan_paspor}
                            onChange={handleChange}
                        />

                        <Input
                            label="Tempat Lahir"
                            name="tempat_lahir"
                            value={formData.tempat_lahir}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Tempat Dikeluarkan Paspor"
                            name="tempat_dikeluarkan_paspor"
                            value={formData.tempat_dikeluarkan_paspor}
                            onChange={handleChange}
                        />

                        <Input
                            label="No. KTP"
                            name="nomor_ktp"
                            value={formData.nomor_ktp}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Masa Berlaku Paspor"
                            type="date"
                            name="masa_berlaku_paspor"
                            value={formData.masa_berlaku_paspor}
                            onChange={handleChange}
                        />

                        <Input
                            label="No Telp"
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Provinsi"
                            name="provinsi"
                            value={formData.provinsi}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Pekerjaan"
                            name="pekerjaan"
                            value={formData.pekerjaan}
                            onChange={handleChange}
                        />

                        <Input
                            label="Kota/Kabupaten"
                            name="kota_kabupaten"
                            value={formData.kota_kabupaten}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label className="block text-sm mb-2 font-medium">
                                Jenis Kelamin
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <div className="flex gap-2 flex-wrap">
                                {["Laki-laki", "Perempuan"].map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    active={formData.jenis_kelamin === item}
                                    variant={
                                    formData.jenis_kelamin === item
                                        ? "contained"
                                        : "outline"
                                    }
                                    onClick={() =>
                                    setFormData({
                                        ...formData,
                                        jenis_kelamin: item,
                                    })
                                    }
                                />
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Alamat Tinggal"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label className="block text-sm mb-2 font-medium">
                                Status Perkawinan
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <div className="flex gap-2 flex-wrap">
                                {[
                                    "Belum Menikah",
                                    "Menikah",
                                    "Cerai",
                                ].map((item) => (
                                    <Chip
                                        key={item}
                                        label={item}
                                        active={formData.status_perkawinan === item}
                                        variant={
                                            formData.status_perkawinan === item
                                            ? "contained"
                                            : "outline"
                                        }
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                status_perkawinan: item,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* KONTAK DARURAT */}
                <Card shadow>
                    <h2 className="text-3xl font-bold text-center">
                        Nomor Kontak Darurat
                    </h2>

                    <p className="text-center text-sm text-sab-gray-500 mt-2 mb-8">
                        Mohon mencantumkan keluarga atau penanggung jawab
                        yang dapat dihubungi sewaktu-waktu
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">

                        {/* KONTAK 1 */}
                        <div>
                            <h3 className="font-bold mb-4">
                                Kontak Darurat 1
                            </h3>

                            <div className="space-y-4">
                                <Input
                                    label="Nama Lengkap"
                                    name="kontak1_nama"
                                    value={formData.kontak1_nama}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Alamat Tinggal"
                                    name="kontak1_alamat"
                                    value={formData.kontak1_alamat}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Hubungan"
                                    name="kontak1_hubungan"
                                    value={formData.kontak1_hubungan}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="No Telp"
                                    name="kontak1_telp"
                                    value={formData.kontak1_telp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* KONTAK 2 */}
                        <div>
                            <h3 className="font-bold mb-4">
                                Kontak Darurat 2 (Opsional)
                            </h3>

                            <div className="space-y-4">
                                <Input
                                    label="Nama Lengkap"
                                    name="kontak2_nama"
                                    value={formData.kontak2_nama}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Alamat Tinggal"
                                    name="kontak2_alamat"
                                    value={formData.kontak2_alamat}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Hubungan"
                                    name="kontak2_hubungan"
                                    value={formData.kontak2_hubungan}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="No Telp"
                                    name="kontak2_telp"
                                    value={formData.kontak2_telp}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* UPLOAD BERKAS */}
                <Card shadow>
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Upload Berkas
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5">
                        <FileUpload
                            name="paspor"
                            label="Paspor"
                            fileName={
                                files.paspor?.name ||
                                getUploadedFile("Paspor")?.nama_berkas
                            }
                            fileUrl={
                                getUploadedFile("Paspor")?.file_url
                            }
                            handleRemove={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter(
                                        (item) => item.jenis_berkas !== "Paspor"
                                    )
                                );

                                setDeletedFiles((prev) => [
                                    ...prev,
                                    "Paspor",
                                ]);

                                setFiles((prev) => ({
                                    ...prev,
                                    paspor: null,
                                }));
                            }}
                            onChange={(e) =>
                                handleFileChange(e, "paspor")
                            }   
                        />

                        <FileUpload
                            name= "buku_nikah"
                            label="Buku Nikah"
                            fileName={files.buku_nikah?.name ||
                                getUploadedFile("Buku Nikah")?.nama_berkas
                            }
                            fileUrl={
                                getUploadedFile("Buku Nikah")?.file_url
                            }
                            handleRemove={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter(
                                        (item) => item.jenis_berkas !== "Buku Nikah"
                                    )
                                );

                                setDeletedFiles((prev) => [
                                    ...prev,
                                    "Buku Nikah",
                                ]);

                                setFiles((prev) => ({
                                    ...prev,
                                    buku_nikah: null,
                                }));
                            }}
                            onChange={(e) =>
                                handleFileChange(e, "buku_nikah")
                            }
                        />

                        <FileUpload
                            name= "buku_vaksin"
                            label="Buku Vaksin"
                            fileName={files.buku_vaksin?.name ||
                                getUploadedFile("Buku Vaksin")?.nama_berkas
                            }
                            fileUrl={
                                getUploadedFile("Buku Vaksin")?.file_url
                            }
                            handleRemove={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter(
                                        (item) => item.jenis_berkas !== "Buku Vaksin"
                                    )
                                );

                                setDeletedFiles((prev) => [
                                    ...prev,
                                    "Buku Vaksin",
                                ]);

                                setFiles((prev) => ({
                                    ...prev,
                                    buku_vaksin: null,
                                }));
                            }}
                            onChange={(e) =>
                                handleFileChange(e, "buku_vaksin")
                            }
                        />

                        <FileUpload
                            name= "pas_foto"
                            label="Pas Foto"
                            fileName={files.pas_foto?.name ||
                                getUploadedFile("Pas Foto")?.nama_berkas
                            }
                            fileUrl={
                                getUploadedFile("Pas Foto")?.file_url
                            }
                            handleRemove={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter(
                                        (item) => item.jenis_berkas !== "Pas Foto"
                                    )
                                );

                                setDeletedFiles((prev) => [
                                    ...prev,
                                    "Pas Foto",
                                ]);

                                setFiles((prev) => ({
                                    ...prev,
                                    pas_foto: null,
                                }));
                            }}
                            onChange={(e) =>
                                handleFileChange(e, "pas_foto")
                            }
                        />

                        <FileUpload
                            name= "akta_lahir"
                            label="Akta Kelahiran"
                            fileName={files.akta_lahir?.name ||
                                getUploadedFile("Akta Kelahiran")?.nama_berkas
                            }
                            fileUrl={
                                getUploadedFile("Akta Kelahiran")?.file_url
                            }
                            handleRemove={() => {
                                setUploadedFiles((prev) =>
                                    prev.filter(
                                        (item) => item.jenis_berkas !== "Akta Kelahiran"
                                    )
                                );

                                setDeletedFiles((prev) => [
                                    ...prev,
                                    "Akta Kelahiran",
                                ]);

                                setFiles((prev) => ({
                                    ...prev,
                                    akta_lahir: null,
                                }));
                            }}
                            onChange={(e) =>
                            handleFileChange(e, "akta_lahir")
                            }
                        />
                        
                        <div>
                            <label className="block text-sm mb-2 font-medium">
                                Dokumen Lainnya
                            </label>

                            <label className="border-2 border-dashed border-primary rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition">
                                <Plus size={18} />

                                <span>Tambah Dokumen</span>

                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFileChange(e, "lainnya")
                                    }
                                />
                            </label>
                        </div>
                    </div>

                    {files.lainnya.length > 0 && (
                        <div className="mt-6">
                            <p className="font-semibold mb-3">
                                Dokumen Tambahan
                            </p>

                            <div className="space-y-2">
                                {files.lainnya.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between border border-primary rounded-xl px-4 py-3 bg-white"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FileText size={18} className="text-primary shrink-0"/>
                                            <span className="truncate">{file.name}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => {
                                                setFiles((prev) => ({
                                                    ...prev,
                                                    lainnya: prev.lainnya.filter(
                                                        (_, i) => i !== index
                                                    ),
                                                }));
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-10">
                        <Button
                            label="Batal"
                            color="secondary"
                            radius="oval"
                            onClick={() => router.back()}
                        />

                        <Button 
                            label="Simpan" 
                            radius="oval"
                            onClick={handleSubmit}
                        />
                    </div>
                </Card>
            </div>
            <ToastComponent
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={closeToast}
            />
        </section>
    );
}

function FileUpload({
    name,
    label,
    fileName,
    fileUrl,
    multiple = false,
    onChange,
    handleRemove,
}: {
    name: string;
    label: string;
    fileName?: string;
    fileUrl?: string;
    multiple?: boolean;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handleRemove?: () => void;
}) {
    return (
        <div>
            <p className="block text-sm mb-2 font-medium">
                {label}
            </p>

            <div className="border-2 border-primary rounded-full px-4 py-2 flex items-center justify-between gap-5">

                {fileName ? (
                    <>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText
                                size={16}
                                className="text-primary"
                            />

                            {fileUrl ? (
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-blue-600 underline"
                                >
                                    {fileName}
                                </a>
                            ) : (
                                <span className="truncate">
                                    {fileName}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleRemove}
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <Upload size={16} />

                        <span>Upload Berkas</span>

                        <input
                            type="file"
                            name={name}
                            multiple={multiple}
                            className="hidden"
                            onChange={onChange}
                        />
                    </label>
                )}
            </div>
        </div>
    );
}