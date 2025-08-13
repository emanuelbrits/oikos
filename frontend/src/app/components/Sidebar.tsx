import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { IconType } from "react-icons";

interface SidebarItem {
  label: string;
  icon: IconType;
  onClick?: () => void;
  href?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title = "Menu" }: SidebarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 right-4 z-50 text-[var(--sunshine)] text-2xl p-2 bg-[var(--mulberry)] rounded-md"
      >
        {open ? <FiX /> : <FiMenu />}
      </button>
      <div
        className={`
          bg-[var(--mulberry)] text-[var(--sunshine)] min-h-screen transition-all duration-300 flex flex-col
          ${open ? "w-64" : "w-16"}
          md:static md:translate-x-0
          fixed top-0 left-0 h-full z-40
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--sunshine)]">
          {open && <h1 className="text-lg font-bold">{title}</h1>}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:block text-xl cursor-pointer"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.href || "#"}
                onClick={item.onClick}
                className="flex items-center gap-3 p-3 hover:bg-[var(--umemurasaki)] transition-colors duration-200"
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
