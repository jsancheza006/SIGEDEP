"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { API_BASE } from "@/utils/api";

interface Resolucion {
  ID_Resolucion: number;
  Resolucion: string;
}

export default function ResolucionesPage() {
  const toast = useRef<Toast>(null);
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingTexto, setEditingTexto] = useState<string>("");

  useEffect(() => {
    cargarResoluciones();
  }, []);

  const cargarResoluciones = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}ResolucionesEspc/index.php`);
      const data = await resp.json();
      if (Array.isArray(data)) {
        setResoluciones(data);
      } else {
        setResoluciones([]);
      }
    } catch (error) {
      console.error("Error al cargar resoluciones:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar las resoluciones" });
    } finally {
      setLoading(false);
    }
  };

  const crearResolucion = async () => {
    if (!nuevoTexto.trim()) {
      toast.current?.show({ severity: "warn", summary: "Validación", detail: "Ingrese el texto de la resolución" });
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}ResolucionesEspc/index.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Resolucion: nuevoTexto.trim() }),
      });

      const text = await resp.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta no JSON:", text);
        throw new Error("El servidor no devolvió JSON válido");
      }

      if (result.error) throw new Error(result.error);

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Resolución creada" });
      setNuevoTexto("");
      cargarResoluciones();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo crear la resolución" });
    }
  };

  const iniciarEdicion = (row: Resolucion) => {
    setEditingRowId(row.ID_Resolucion);
    setEditingTexto(row.Resolucion);
  };

  const cancelarEdicion = () => {
    setEditingRowId(null);
    setEditingTexto("");
  };

  const guardarEdicion = async (id: number) => {
    if (!editingTexto.trim()) {
      toast.current?.show({ severity: "warn", summary: "Validación", detail: "El texto no puede estar vacío" });
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}ResolucionesEspc/index.php?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Resolucion: editingTexto.trim() }),
      });

      const text = await resp.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta no JSON:", text);
        throw new Error("El servidor no devolvió JSON válido");
      }

      if (result.error) throw new Error(result.error);

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Resolución actualizada" });
      cancelarEdicion();
      cargarResoluciones();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo actualizar la resolución" });
    }
  };

  const confirmarEliminar = (row: Resolucion) => {
    confirmDialog({
      message: `¿Eliminar la resolución "${row.Resolucion}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => eliminarResolucion(row.ID_Resolucion),
    });
  };

  const eliminarResolucion = async (id: number) => {
    try {
      const resp = await fetch(`${API_BASE}ResolucionesEspc/index.php?id=${id}`, {
        method: "DELETE",
      });
      const text = await resp.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta no JSON:", text);
        throw new Error("El servidor no devolvió JSON válido");
      }

      if (result.error) throw new Error(result.error);

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Resolución eliminada" });
      cargarResoluciones();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo eliminar la resolución" });
    }
  };

  const accionesTemplate = (row: Resolucion) => {
    const isEditing = editingRowId === row.ID_Resolucion;
    return (
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => iniciarEdicion(row)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarEliminar(row)} />
          </>
        ) : (
          <>
            <Button icon="pi pi-check" className="p-button-rounded p-button-success" onClick={() => guardarEdicion(row.ID_Resolucion)} />
            <Button icon="pi pi-times" className="p-button-rounded p-button-secondary" onClick={cancelarEdicion} />
          </>
        )}
      </div>
    );
  };

  const resolucionTemplate = (row: Resolucion) => {
    const isEditing = editingRowId === row.ID_Resolucion;
    if (!isEditing) return row.Resolucion;
    return (
      <InputText value={editingTexto} onChange={(e) => setEditingTexto(e.target.value)} className="w-full" />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-between">
      <h2 className="text-2xl font-bold text-[#172951]">Resoluciones</h2>
      <div className="flex gap-2">
        <InputText
          type="search"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-80"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <a href="/Admin/datos" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-4">
            <i className="pi pi-arrow-left mr-2"></i>
            Volver a Gestión de Datos
          </a>
          <h1 className="text-4xl font-bold text-[#172951] mb-2">Gestión de Resoluciones</h1>
          <p className="text-gray-600">Administra las resoluciones disponibles en el sistema.</p>
        </div>

        <Card className="shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <InputText
              placeholder="Texto de la resolución"
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              className="flex-1"
            />
            <Button label="Agregar Resolución" icon="pi pi-plus" className="p-button-success" onClick={crearResolucion} />
          </div>
        </Card>

        <Card className="shadow-lg">
          <DataTable
            value={resoluciones}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            dataKey="ID_Resolucion"
            globalFilter={globalFilter}
            header={header}
            emptyMessage="No se encontraron resoluciones."
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="ID_Resolucion" header="ID" sortable style={{ minWidth: "80px" }} />
            <Column header="Resolución" body={resolucionTemplate} sortable style={{ minWidth: "300px" }} />
            <Column header="Acciones" body={accionesTemplate} exportable={false} style={{ minWidth: "150px", textAlign: "center" }} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
