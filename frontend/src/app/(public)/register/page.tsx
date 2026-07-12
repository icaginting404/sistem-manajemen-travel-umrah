import Image from "next/image";
import Link from "next/link";
import Card from "@/src/components/atoms/card.component";
import RegisterForm from "@/src/components/forms/register-form.component";

export default function RegisterPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <Card shadow className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="mb-3"
            />

            <h2 className="text-xl font-bold">
              Daftar Akun
            </h2>

            <p className="mt-2 text-center text-sm text-sab-gray-300">
              Silakan lengkapi data diri untuk
              <br />
              mulai menggunakan layanan kami.
            </p>

            <div className="mt-6 w-full">
              <RegisterForm />
            </div>

            <p className="mt-5 text-sm text-sab-gray-300">
              Sudah Punya Akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary"
              >
                Masuk
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}