"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const adminCards = [
    {
      title: "Gestión de Funcionarios",
      description: "Registrar y administrar funcionarios del MEP",
      icon: "pi pi-users",
      route: "/Admin/funcionarios",
      color: "bg-blue-950",
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios y permisos del sistema",
      icon: "pi pi-user-edit",
      route: "/Admin/usuarios",
      color: "bg-black",
      disabled: true,
    },
    {
      title: "Reportes y Estadísticas",
      description: "Visualizar reportes generales del sistema",
      icon: "pi pi-chart-bar",
      route: "/Admin/reportes",
      color: "bg-black",
      disabled: true,
    },
    {
      title: "Configuración",
      description: "Configurar parámetros del sistema",
      icon: "pi pi-cog",
      route: "/Admin/configuracion",
      color: "bg-black",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header del Dashboard */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#172951] mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, <span className="font-semibold">{userEmail}</span>
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => !card.disabled && router.push(card.route)}
            >
              <div className="flex flex-col items-center text-center gap-4 p-4">
                <div
                  className={`${card.color} ${
                    card.disabled ? "opacity-50" : ""
                  } w-20 h-20 rounded-full flex items-center justify-center`}
                >
                  <i className={`${card.icon} text-white text-4xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#172951] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
                <Button
                  label={card.disabled ? "Próximamente" : "Acceder"}
                  icon={card.disabled ? "pi pi-lock" : "pi pi-arrow-right"}
                  className={`${
                    card.disabled
                      ? "p-button-secondary opacity-50"
                      : "p-button-primary"
                  } w-full`}
                  disabled={card.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!card.disabled) router.push(card.route);
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Sección de Acciones Rápidas */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#172951] mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md">
              <div className="flex items-center gap-4">
                <i className="pi pi-file-plus text-3xl text-blue-950"></i>
                <div>
                  <h4 className="font-semibold text-[#172951]">
                    Nuevo Funcionario
                  </h4>
                  <p className="text-sm text-gray-600">
                    Registrar un nuevo funcionario
                  </p>
                </div>
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded p-button-primary ml-auto"
                  onClick={() => router.push("/Admin/funcionarios/crear")}
                />
              </div>
            </Card>

            <Card className="shadow-md opacity-50">
              <div className="flex items-center gap-4">
                <i className="pi pi-download text-3xl text-black"></i>
                <div>
                  <h4 className="font-semibold text-[#172951]">
                    Exportar Datos
                  </h4>
                  <p className="text-sm text-gray-600">
                    Descargar reportes en Excel
                  </p>
                </div>
                <Button
                  icon="pi pi-download"
                  className="p-button-rounded p-button-secondary ml-auto"
                  disabled
                />
              </div>
            </Card>

            <Card className="shadow-md opacity-50">
              <div className="flex items-center gap-4">
                <i className="pi pi-refresh text-3xl text-black"></i>
                <div>
                  <h4 className="font-semibold text-[#172951]">
                    Sincronizar Datos
                  </h4>
                  <p className="text-sm text-gray-600">
                    Actualizar información del sistema
                  </p>
                </div>
                <Button
                  icon="pi pi-refresh"
                  className="p-button-rounded p-button-secondary ml-auto"
                  disabled
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
