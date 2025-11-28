"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function GestionDatosPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-8">
      <div className="w-full max-w-7xl mb-6">
        <a 
          href="/Admin" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-4"
        >
          <i className="pi pi-arrow-left mr-2"></i>
          Volver al Dashboard
        </a>
        <h1 className="text-4xl font-bold text-[#172951] mb-2">Gestión de Datos</h1>
        <p className="text-gray-600">Administra catálogos y parámetros del sistema desde aquí.</p>
      </div>

      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-bold text-[#172951] mb-4">Catálogos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <div className="flex items-center gap-4">
              <i className="pi pi-bars text-3xl text-blue-950"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-[#172951]">Niveles</h4>
                <p className="text-sm text-gray-600">Primero, Segundo, Séptimo, etc.</p>
              </div>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-rounded p-button-primary"
                onClick={() => router.push("/Admin/datos/niveles")}
              />
            </div>
          </Card>

          <Card className="shadow-lg">
            <div className="flex items-center gap-4">
              <i className="pi pi-sitemap text-3xl text-green-700"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-[#172951]">Servicios</h4>
                <p className="text-sm text-gray-600">Tipos de servicios disponibles.</p>
              </div>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-rounded p-button-success"
                onClick={() => router.push("/Admin/datos/servicios")}
              />
            </div>
          </Card>

          <Card className="shadow-lg">
            <div className="flex items-center gap-4">
              <i className="pi pi-file-edit text-3xl text-purple-700"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-[#172951]">Resoluciones</h4>
                <p className="text-sm text-gray-600">Gestión de resoluciones.</p>
              </div>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-rounded"
                onClick={() => router.push("/Admin/datos/resoluciones")}
              />
            </div>
          </Card>

          <Card className="shadow-lg">
            <div className="flex items-center gap-4">
              <i className="pi pi-book text-3xl text-orange-600"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-[#172951]">Ofertas Educativas</h4>
                <p className="text-sm text-gray-600">Modalidades y ofertas educativas.</p>
              </div>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-rounded p-button-warning"
                onClick={() => router.push("/Admin/datos/ofertas")}
              />
            </div>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-[#172951] mb-4">Parámetros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg opacity-50">
            <div className="flex items-center gap-4">
              <i className="pi pi-cog text-3xl text-black"></i>
              <div className="flex-1">
                <h4 className="font-semibold text-[#172951]">Configuración General</h4>
                <p className="text-sm text-gray-600">Ajustes del sistema.</p>
              </div>
              <Button
                icon="pi pi-arrow-right"
                className="p-button-rounded p-button-secondary"
                disabled
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
