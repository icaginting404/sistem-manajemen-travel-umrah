"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileDropdown from "./profile-dropdown.component";
import Button from "@/src/components/atoms/button.component";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  href: string;
}

interface DropdownItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  divider?: boolean;
}

interface NavbarProps {
  menus?: MenuItem[];
  dropdownItems?: DropdownItem[];
}

const Navbar = ({
  menus = [],
  dropdownItems = [],
}: NavbarProps) => {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<{
        nama: string;
        email: string;
    } | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoggedIn(false);
        setUser(null);

        router.push("/");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);
        setLoggedIn(!!token);
        const userData = localStorage.getItem("user");
        console.log("USER:", userData);

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
            dropdownRef.current &&
            !dropdownRef.current.contains(
                event.target as Node
            )
            ) {
            setIsDropdownOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
            "mousedown",
            handleClickOutside
            );
        };
    }, []);

    const profileItems = dropdownItems.map((item) => {
        if (item.label === "Keluar") {
            return {
                ...item,
                onClick: handleLogout,
            };
        }
        return item;
    });

    console.log("LOGGED IN:", loggedIn);

    return (
        <nav className="sticky top-0 left-0 w-full h-16 px-5 md:px-10 py-2 flex items-center justify-between z-50 bg-sab-white-300 shadow-sm">
            <div className="flex items-center gap-1">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={55}
                    height={70} 
                />
                <div>
                    <span className="block text-sm font-bold text-secondary pt-1 leading-none">
                        Syifa Amanah
                    </span>

                    <span className="block text-sm font-bold text-secondary leading-none">
                        Baitullah
                    </span>

                    <span className="block text-xs text-secondary">
                        Tour & Travel
                    </span>
                </div>
            </div>
            
            {/* DESKTOP MENU */}
            <ul className="hidden md:flex items-center gap-10 font-semibold">
                {menus.map((menu) => (
                    <li key={menu.href}>
                        <Link
                            href={menu.href}
                            className="
                            text-secondary
                            transition-colors
                            duration-200
                            hover:text-primary
                            "
                        >
                            {menu.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-3">
                {loggedIn ? (
                    <div ref={dropdownRef} className="relative hidden md:block">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen )}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                src="/test-profile.jpg"
                                alt="Profile"
                                width={45}
                                height={45}
                                className="w-full h-full object-cover"
                                />
                            </div>

                            <ChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${
                                isDropdownOpen
                                    ? "rotate-180"
                                    : ""
                                }`}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3">
                                <ProfileDropdown
                                    name={user?.nama}
                                    email={user?.email}
                                    items={profileItems}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                // BEFORE LOGIN
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            color="primary"
                            label="Masuk"
                            radius="oval"
                            onClick={() => router.push("/login")}
                        />

                        <Button
                            color="primary"
                            label="Daftar"
                            radius="oval"
                            variant="outline"
                            onClick={() => router.push("/register")}
                        />
                    </div>
                )}

                {/* MOBILE BUTTON */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden"
                >
                    <div className="transition-transform duration-300">
                        {isMobileMenuOpen ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}
                    </div>
                </button>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-sab-white-300 shadow-lg px-6 py-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-sab-gray-100">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                            src="/test-profile.jpg"
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-secondary">
                            {user?.nama}
                            </h3>

                            <p className="text-xs text-sab-gray-300 italic">
                            {user?.email}
                            </p>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-3 py-1 font-semibold">
                        {menus.map((menu) => (
                            <li key={menu.href}>
                                <Link href={menu.href}>
                                    {menu.label}
                                </Link>
                            </li>
                        ))}
                        {!loggedIn && (
                            <div className="flex flex-col gap-2 pt-4">
                                <Button
                                label="Masuk"
                                onClick={() => router.push("/login")}
                                />

                                <Button
                                label="Daftar"
                                variant="outline"
                                onClick={() => router.push("/register")}
                                />
                            </div>
                        )}
                    </ul>
                    <div className="flex flex-col gap-2 pt-1">
                        {profileItems.map((item, index) =>
                            item.href ? (
                            <Link
                                key={index}
                                href={item.href}
                                className={`
                                flex items-center gap-3 text-sm font-medium transition-colors duration-200 py-1
                                ${
                                    item.danger
                                    ? "text-red-500 hover:text-red-700"
                                    : "text-secondary hover:text-primary"
                                }
                                ${
                                    item.divider
                                    ? "border-t border-sab-gray-100 mt-2 pt-3"
                                    : ""
                                }
                                `}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                            ) : (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className={`
                                flex items-center gap-3 text-sm font-medium transition-colors duration-200 py-1
                                ${
                                    item.danger
                                    ? "text-red-500 hover:text-red-700"
                                    : "text-secondary hover:text-primary"
                                }
                                ${
                                    item.divider
                                    ? "border-t border-sab-gray-100 mt-2 pt-3"
                                    : ""
                                }
                                `}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                            )
                        )}
                        </div>
                </div>
            )}
        </nav>  
    )
}

export default Navbar;