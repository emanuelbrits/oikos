import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { FiHome, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { TbHotelService } from "react-icons/tb";
import { IoIosPerson } from "react-icons/io";
import { LuClock4, LuCupSoda } from "react-icons/lu";
import { MdBedroomParent, MdOutlineShoppingCart } from "react-icons/md";
import Image from 'next/image'

interface SidebarItem {
  label: string;
  icon: IconType;
  onClick?: () => void;
  href?: string;
}

interface SidebarProps {
  title?: string;
}

export default function Sidebar({ title = "Menu" }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const items: SidebarItem[] = [
    { label: "Início", icon: FiHome, href: "/" },
    { label: "Hospedagens", icon: TbHotelService, href: "/hospedagens" },
    { label: "Hóspedes", icon: IoIosPerson, href: "/hospedes" },
    { label: "Reservas", icon: LuClock4, href: "/reservas" },
    { label: "Quartos", icon: MdBedroomParent, href: "/quartos" },
    { label: "Consumos", icon: MdOutlineShoppingCart, href: "/consumos" },
    { label: "Produtos", icon: LuCupSoda, href: "/produtos" },
    { label: "Sair", icon: FiLogOut, onClick: () => logout() },
  ];

  return (
    <div className="flex">
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 right-4 z-50 text-[var(--sunshine)] text-2xl p-2 bg-[var(--navy)] rounded-md"
      >
        {open ? <FiX /> : <FiMenu />}
      </button>

      <div
        className={`
      bg-[var(--navy)] text-[var(--sunshine)] transition-all duration-300 flex flex-col
      ${open ? "w-64" : "w-16"}
      fixed top-0 left-0 h-full z-40
      lg:sticky lg:top-0 lg:h-screen
      ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--sunshine)]">
          {open && <Image
            src="/oikos-logo.png"
            width={128}
            height={128}
            alt="Logo"
            className="w-16 h-16 rounded-full border-2 border-[var(--sunshine)] shadow-2xl p-1 bg-white"
          />}
          <button
            onClick={() => setOpen(!open)}
            className="hidden lg:block text-xl cursor-pointer"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.href || "#"}
                onClick={item.onClick}
                className="flex items-center gap-3 p-3 hover:bg-[var(--seaBlue)] transition-colors duration-200"
              >
                <Icon className="text-xl" />
                {open && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
