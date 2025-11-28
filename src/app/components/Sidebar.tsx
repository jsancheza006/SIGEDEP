"use client";

import { useSidebar } from "../context/SidebarContext";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const { isSidebarVisible, setSidebarVisible } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Menú para usuarios normales
  const userNavItems = [
    {
      label: "Inicio",
      href: "/dashboard",
      icon: "pi pi-home",
    },

    {
      label: "Fiscalización",
      icon: "pi pi-shield",
      submenu: [
        { label: "Registros", href: "/dashboard/fiscalizacion" },
        { label: "Ver Seguimientos", href: "/dashboard/fiscalizacion/estadisticas" },
      ],
    },

    {
      label: "Análisis Técnico",
      icon: "pi pi-chart-bar",
      submenu: [
        { label: "Fichas SABER", href: "/dashboard/analisis" },
        { label: "Ver Resultados", href: "/dashboard/analisis/estadisticas" },
      ],
    },
  ];

  // Menú para administradores
  const adminNavItems = [
    {
      label: "Dashboard",
      href: "/Admin",
      icon: "pi pi-home",
    },
    {
      label: "Gestión de Funcionarios",
      icon: "pi pi-users",
      submenu: [
        { label: "Nuevo Funcionario", href: "/Admin/funcionarios/crear" },
        { label: "Lista de Funcionarios", href: "/Admin/funcionarios" },
      ],
    },
    {
      label: "Gestión de Datos",
      href: "/Admin/datos",
      icon: "pi pi-database",
    },
    {
      label: "Reportes",
      href: "/Admin/reportes",
      icon: "pi pi-chart-bar",
    },
    {
      label: "Configuración",
      href: "/Admin/configuracion",
      icon: "pi pi-cog",
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <PrimeSidebar
      visible={isSidebarVisible}
      onHide={() => setSidebarVisible(false)}
      showCloseIcon={false}
      className="w-64 h-screen bg-white text-gray-900 border-r shadow-lg p-4"
    >
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image src="/favicon.png" alt="Logo" width={75} height={75} priority />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-8 text-center">
        Menú Principal
      </h2>

      {/* ESPACIADO UNIFORME ENTRE ITEMS */}
      <ul className="flex flex-col gap-[22px]">
        {navItems.map((item) => (
          <li key={item.label} className="!mb-0">
            {/* ITEM SIN SUBMENÚ */}
            {!item.submenu ? (
              <Button
                label={item.label}
                icon={item.icon}
                className="w-full flex items-center justify-start bg-gray-100 text-gray-700
                hover:bg-gradient-to-l hover:from-[#12142B] hover:to-[#1A2B6C] hover:text-white
                p-3 rounded-lg transition-all"
                onClick={() => {
                  router.push(item.href!);
                  setSidebarVisible(false);
                }}
              />
            ) : (
              <>
                {/* ITEM CON SUBMENÚ */}
                <Button
                  label={item.label}
                  icon={item.icon}
                  className={`w-full flex items-center justify-between bg-gray-100 text-gray-700
                    hover:bg-gradient-to-l hover:from-[#12142B] hover:to-[#1A2B6C] hover:text-white
                    p-3 rounded-lg transition-all
                    ${openSubmenu === item.label ? "bg-[#CDA95F] text-gray-900" : ""}
                  `}
                  onClick={() => toggleSubmenu(item.label)}
                >
                  <span className="ml-auto pr-1">
                    <i
                      className={`pi pi-chevron-${
                        openSubmenu === item.label ? "up" : "down"
                      }`}
                    />
                  </span>
                </Button>

                {/* SUBMENÚ CON ANIMACIÓN SUAVE */}
                <ul
                  className={`
                    pl-4 mt-2 space-y-2 overflow-hidden transition-all duration-500
                    ${openSubmenu === item.label ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  {item.submenu.map((sub) => (
                    <li key={sub.label} className="!mb-0">
                      <Button
                        label={sub.label}
                        className="w-full justify-start bg-gray-100 text-gray-700
                        hover:bg-gradient-to-l hover:from-[#12142B] hover:to-[#1A2B6C] hover:text-white
                        px-3 py-2 rounded-md transition-all"
                        onClick={() => {
                          router.push(sub.href);
                          setSidebarVisible(false);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </PrimeSidebar>
  );
}
