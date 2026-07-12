import Navbar from "@/src/components/UI/navbar.component";
import { LogOut } from "lucide-react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        menus={[
          {
            label: "Executive Dashboard",
            href: "/owner/dashboard",
          },
        ]}
        dropdownItems={[
          {
            label: "Keluar",
            icon: <LogOut size={18} />,
            danger: true,
            divider: true,
          },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        {children}
      </main>
    </>
  );
}