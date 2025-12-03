"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRef } from "react";
import { API_BASE } from "@/utils/api";

interface Funcionario {
  ID_Funcionario: string;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Numero: string;
  Contrasena: string;
  Rol?: string;
}

export default function ListaFuncionarios() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    cargarFuncionarios();
  }, []);

  const cargarFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}Funcionario/index.php`);
      const data = await response.json();
      
      // La API devuelve directamente un array de funcionarios
      if (Array.isArray(data)) {
        setFuncionarios(data);
      } else {
        console.error("Respuesta inesperada de la API:", data);
        setFuncionarios([]);
      }
    } catch (error) {
      console.error("Error al cargar funcionarios:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los funcionarios",
        life: 3000,
      });
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminar = (funcionario: Funcionario) => {
    confirmDialog({
      message: `¿Está seguro de eliminar al funcionario ${funcionario.Nombre} ${funcionario.Apellido}?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => eliminarFuncionario(funcionario.ID_Funcionario),
    });
  };

  const eliminarFuncionario = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}Funcionario/index.php?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      // La API devuelve {message: "..."} en éxito o {error: "..."} en error
      if (data.message) {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: data.message,
          life: 3000,
        });
        cargarFuncionarios();
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error instanceof Error ? error.message : "No se pudo eliminar el funcionario",
        life: 3000,
      });
    }
  };

  const accionesTemplate = (rowData: Funcionario) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => router.push(`/Admin/funcionarios/editar/${rowData.ID_Funcionario}`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          tooltip="Eliminar"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmarEliminar(rowData)}
        />
      </div>
    );
  };

  const nombreCompletoTemplate = (rowData: Funcionario) => {
    return `${rowData.Nombre} ${rowData.Apellido}`;
  };

  const rolTemplate = (rowData: Funcionario) => {
    // accept several possible field names returned by the API
    return rowData.Rol ?? (rowData as any).rol ?? (rowData as any).role ?? "—";
  };

  const header = (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#172951]">Lista de Funcionarios</h2>
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <InputText
          type="search"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:w-80"
        />
        <Button
          label="Nuevo Funcionario"
          icon="pi pi-plus"
          className="p-button-success w-full sm:w-auto"
          onClick={() => router.push("/Admin/funcionarios/crear")}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 py-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb y título */}
        <div className="mb-6 px-2 sm:px-0">
          <Button
            icon="pi pi-arrow-left"
            label="Volver al Dashboard"
            className="p-button-text p-button-plain mb-4"
            onClick={() => router.push("/Admin")}
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#172951] mb-2">
            Gestión de Funcionarios
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Administra los funcionarios registrados en el sistema
          </p>
        </div>

        {/* Tabla de Funcionarios */}
        <Card className="shadow-lg">
          <div className="overflow-auto">
            <DataTable
              value={funcionarios}
              loading={loading}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              dataKey="ID_Funcionario"
              globalFilter={globalFilter}
              header={header}
              emptyMessage="No se encontraron funcionarios."
              className="custom-table"
              stripedRows
              responsiveLayout="stack"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} funcionarios"
            >
              <Column
                field="ID_Funcionario"
                header="ID"
                sortable
                style={{ minWidth: "60px" }}
              />
              <Column
                header="Nombre Completo"
                body={nombreCompletoTemplate}
                sortable
                sortField="Nombre"
                style={{ minWidth: "160px" }}
              />
              <Column
                field="Correo"
                header="Correo Electrónico"
                sortable
                style={{ minWidth: "180px" }}
              />
              <Column
                field="Rol"
                header="Rol"
                body={rolTemplate}
                sortable
                style={{ minWidth: "100px" }}
              />
              <Column
                field="Numero"
                header="Teléfono"
                sortable
                style={{ minWidth: "100px" }}
              />
              <Column
                header="Acciones"
                body={accionesTemplate}
                exportable={false}
                style={{ minWidth: "120px", textAlign: "center" }}
              />
            </DataTable>
          </div>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <i className="pi pi-users text-blue-600 text-3xl"></i>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Funcionarios</p>
                <p className="text-2xl font-bold text-[#172951]">{funcionarios.length}</p>
              </div>
            </div>
          </Card>

          <Card className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <i className="pi pi-check-circle text-green-600 text-3xl"></i>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Activos</p>
                <p className="text-2xl font-bold text-[#172951]">{funcionarios.length}</p>
              </div>
            </div>
          </Card>

          <Card className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <i className="pi pi-calendar text-purple-600 text-3xl"></i>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Último Registro</p>
                <p className="text-sm font-semibold text-[#172951]">Hoy</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
