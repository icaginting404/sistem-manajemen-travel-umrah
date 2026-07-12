"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarComponent from "@/src/components/UI/sidebar.component";
import { SquarePen, LogOut } from "lucide-react";
import Navbar from "@/src/components/UI/navbar.component";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== "admin") {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex h-screen flex-col">
      <Navbar
        dropdownItems={[
          {
            label: "Edit Profile",
            icon: <SquarePen size={18} />,
          },
          {
            label: "Keluar",
            icon: <LogOut size={18} />,
            danger: true,
            divider: true,
          },
        ]}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
