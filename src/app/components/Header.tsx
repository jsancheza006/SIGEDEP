"use client";
import { redirect, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import { Menu } from "primereact/menu";
import { useRef, useEffect, useState } from "react";

export default function Header() {
  const { setSidebarVisible } = useSidebar();
  const router = useRouter();
  const menuRef = useRef<Menu>(null);

  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
    setHydrated(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-2 px-4 bg-[#12142B] border-none shadow-md">
      {/* Sección Izquierda: Menú y Logo */}
      <div className="flex items-center space-x-2">
        {hydrated && isAuthenticated && (
          <Button
            icon="pi pi-bars"
            className="p-button-text text-white text-xl"
            onClick={() => setSidebarVisible(true)}
          />
        )}
        <Image
          src="/Logo_mep-DORADO.png"
          alt="Ministerio de Educación Pública"
          width={385}
          height={105}
          priority
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />
      </div>

      {/* Sección Derecha: Menú Usuario */}
      {hydrated && isAuthenticated && (
        <div className="relative">
          <Button
            icon="pi pi-user"
            className="p-button-text text-white text-xl hover:text-[#C2A869] transition-all duration-300"
            onClick={(e) => menuRef.current?.toggle(e)}
          />
          <Menu
            model={[
              { label: "Perfil", icon: "pi pi-user" },
              { separator: true },
              { label: "Cerrar Sesión", icon: "pi pi-sign-out", command: () => {
                localStorage.removeItem("isAuthenticated");
                router.push("/login");
              }}
            ]}
            popup
            ref={menuRef}
          />
        </div>
      )}
    </header>
  );
}
