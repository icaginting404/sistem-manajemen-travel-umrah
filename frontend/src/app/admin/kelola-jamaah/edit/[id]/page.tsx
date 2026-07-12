"use client";
import { useParams } from "next/navigation";
import JamaahForm from "@/src/components/forms/jamaah-form.component";

export default function EditJamaahPage() {
    const params = useParams();

    return (
        <JamaahForm userId={Number(params.id)} isAdmin/>
    );
}