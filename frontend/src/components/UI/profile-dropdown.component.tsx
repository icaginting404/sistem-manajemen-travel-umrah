"use client";

import React from "react";
import Card from "@/src/components/atoms/card.component";
import Link from "next/link";

interface DropdownItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  divider?: boolean;
}

interface ProfileDropdownProps {
  name?: string;
  email?: string;
  items?: DropdownItem[];
}

const ProfileDropdown = ({
  name,
  email,
  items = [],
}: ProfileDropdownProps) => {
  return (
    <Card shadow className="w-64 border border-sab-gray-100">
      <div className="pb-4 border-b text-center border-sab-gray-100">
        <h3 className="text-sm font-semibold text-secondary">
          {name || "-"}
        </h3>

        <p className="text-sm italic text-sab-gray-300">
          {email || "-"}
        </p>
      </div>

      <div className="flex flex-col pt-4">
        {items.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className={`
              flex items-center gap-3 text-sm font-medium transition-colors duration-200 cursor-pointer p-3 hover:bg-primary rounded-md
              ${
                item.danger
                  ? "text-red-500 hover:text-red-700"
                  : "text-secondary hover:text-secondary font-bold"
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
            type="button"
            onClick={item.onClick}
            className={`
              flex items-center gap-3 text-sm font-medium transition-colors duration-200 cursor-pointer p-3 hover:bg-primary rounded-md
              ${
                item.danger
                  ? "text-red-500 hover:text-red-700"
                  : "text-secondary hover:text-secondary font-bold"
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
    </Card>
  );
};

export default ProfileDropdown;