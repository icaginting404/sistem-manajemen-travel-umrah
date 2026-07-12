"use client";
import { useEffect, useState } from "react";
import Card from "@/src/components/atoms/card.component";
import Input from "@/src/components/atoms/text-input.component";
import Button from "@/src/components/atoms/button.component";

type Paket = {
    id: number;
    nama_paket: string;
    jadwal_keberangkatan: string;
};

export type JadwalManasikFormData = {
    paket_id: string;
    jadwal_keberangkatan: string;
    lokasi_acara: string;
    tanggal_acara: string;
    waktu_acara: string;
    pemateri: string;
    keterangan: string;
};

interface JadwalManasikFormProps {
    formData: JadwalManasikFormData;
    setFormData: React.Dispatch<
        React.SetStateAction<JadwalManasikFormData>
    >;
    onSubmit: () => void;
    onCancel?: () => void;
    submitLabel?: string;
    disablePaket?: boolean;
}

export default function JadwalManasikForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    submitLabel = "Simpan",
    disablePaket = false,
}: JadwalManasikFormProps) {

    const [paketList, setPaketList] = useState<Paket[]>([]);

    useEffect(() => {
        const getPaket = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/paket-umrah`
                );

                const data = await res.json();

                setPaketList(data);
            } catch (error) {
                console.error(error);
            }
        };

        getPaket();
    }, []);

    const handlePaketChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const paketId = e.target.value;
        const selectedPaket = paketList.find(
            (item) => item.id.toString() === paketId
        );

        setFormData((prev) => ({
            ...prev,
            paket_id: paketId,
            jadwal_keberangkatan:
            selectedPaket?.jadwal_keberangkatan
                ? new Date(
                    selectedPaket.jadwal_keberangkatan
                ).toLocaleDateString("id-ID")
                : "",
        }));
    };

    return (
        <>
            <Card shadow>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sab-gray-500 font-medium pb-2">
                                Pilih Paket
                            </label>

                            {disablePaket ? (
                                <Input
                                    value={
                                        paketList.find(
                                            (paket) =>
                                                paket.id.toString() === formData.paket_id
                                        )?.nama_paket || ""
                                    }
                                    disabled
                                />
                            ) : (
                                <select
                                    value={formData.paket_id}
                                    onChange={handlePaketChange}
                                    className="
                                        w-full
                                        border-2
                                        border-primary
                                        rounded-full
                                        px-4
                                        py-2
                                        outline-none
                                    "
                                >
                                    <option value="">Pilih Paket</option>

                                    {paketList.map((paket) => (
                                        <option key={paket.id} value={paket.id}>
                                            {paket.nama_paket}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <Input
                            label="Lokasi Acara"
                            value={formData.lokasi_acara}
                            onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                    lokasi_acara: e.target.value,
                                }))
                            }
                        />

                        <Input
                            label="Pemateri"
                            value={formData.pemateri}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                        pemateri: e.target.value,
                                }))
                            }
                        />

                        <div>
                            <label className="block text-sab-gray-500 font-medium pb-2">
                                Keterangan
                            </label>

                            <textarea
                                rows={5}
                                value={formData.keterangan}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        keterangan: e.target.value,
                                    }))
                                }
                                className="w-full border-2 border-primary rounded-2xl p-4 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Keberangkatan"
                            value={formData.jadwal_keberangkatan}
                            disabled
                        />

                        <Input
                            label="Tanggal Acara"
                            type="date"
                            value={formData.tanggal_acara}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tanggal_acara: e.target.value,
                                }))
                            }
                        />

                        <Input
                            label="Waktu Acara"
                            type="time"
                            value={formData.waktu_acara}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    waktu_acara: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-3 mt-6">
                <Button
                    label="Batal"
                    color="secondary"
                    radius="oval"
                    onClick={onCancel}
                /> 

                <Button
                label={submitLabel}
                radius="oval"
                onClick={onSubmit}
                />
            </div>
        </>
    );
}