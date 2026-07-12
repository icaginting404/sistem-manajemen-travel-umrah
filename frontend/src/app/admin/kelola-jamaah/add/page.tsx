"use client";
import RegisterForm from "@/src/components/forms/register-form.component";
import Card from "@/src/components/atoms/card.component";

export default function AddJamaahPage() {
  return (
    <section className="bg-sab-bg-gray min-h-screen p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Tambah Jamaah
        </h1>

        <RegisterForm isAdmin />
      </Card>
    </section>
  );
}