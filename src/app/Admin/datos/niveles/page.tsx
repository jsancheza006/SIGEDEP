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

interface Nivel {
  ID_nivel: number;
  Nombre: string;
}

export default function NivelesPage() {
  const toast = useRef<Toast>(null);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingNombre, setEditingNombre] = useState<string>("");

  useEffect(() => {
    cargarNiveles();
  }, []);

  const cargarNiveles = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}NivelesEspc/index.php`);
      const data = await resp.json();
      if (Array.isArray(data)) {
        setNiveles(data);
      } else {
        setNiveles([]);
      }
    } catch (error) {
      console.error("Error al cargar niveles:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar los niveles" });
    } finally {
      setLoading(false);
    }
  };

  const crearNivel = async () => {
    if (!nuevoNombre.trim()) {
      toast.current?.show({ severity: "warn", summary: "Validación", detail: "Ingrese un nombre de nivel" });
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}NivelesEspc/index.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre: nuevoNombre.trim() }),
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

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Nivel creado" });
      setNuevoNombre("");
      cargarNiveles();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo crear el nivel" });
    }
  };

  const iniciarEdicion = (row: Nivel) => {
    setEditingRowId(row.ID_nivel);
    setEditingNombre(row.Nombre);
  };

  const cancelarEdicion = () => {
    setEditingRowId(null);
    setEditingNombre("");
  };

  const guardarEdicion = async (id: number) => {
    if (!editingNombre.trim()) {
      toast.current?.show({ severity: "warn", summary: "Validación", detail: "El nombre no puede estar vacío" });
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}NivelesEspc/index.php?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nombre: editingNombre.trim() }),
      });

      const text = await resp.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta del JSON:", text);
        throw new Error("El servidor no devolvió JSON válido");
      }

      if (result.error) throw new Error(result.error);

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Nivel actualizado" });
      cancelarEdicion();
      cargarNiveles();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo actualizar el nivel" });
    }
  };

  const confirmarEliminar = (row: Nivel) => {
    confirmDialog({
      message: `¿Eliminar el nivel "${row.Nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => eliminarNivel(row.ID_nivel),
    });
  };

  const eliminarNivel = async (id: number) => {
    try {
      const resp = await fetch(`${API_BASE}NivelesEspc/index.php?id=${id}`, {
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

      toast.current?.show({ severity: "success", summary: "Éxito", detail: result.message || "Nivel eliminado" });
      cargarNiveles();
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: error instanceof Error ? error.message : "No se pudo eliminar el nivel" });
    }
  };

  const accionesTemplate = (row: Nivel) => {
    const isEditing = editingRowId === row.ID_nivel;
    return (
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => iniciarEdicion(row)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarEliminar(row)} />
          </>
        ) : (
          <>
            <Button icon="pi pi-check" className="p-button-rounded p-button-success" onClick={() => guardarEdicion(row.ID_nivel)} />
            <Button icon="pi pi-times" className="p-button-rounded p-button-secondary" onClick={cancelarEdicion} />
          </>
        )}
      </div>
    );
  };

  const nombreTemplate = (row: Nivel) => {
    const isEditing = editingRowId === row.ID_nivel;
    if (!isEditing) return row.Nombre;
    return (
      <InputText value={editingNombre} onChange={(e) => setEditingNombre(e.target.value)} className="w-full" />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-between">
      <h2 className="text-2xl font-bold text-[#172951]">Niveles</h2>
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
          <h1 className="text-4xl font-bold text-[#172951] mb-2">Gestión de Niveles</h1>
          <p className="text-gray-600">Administra los niveles educativos disponibles.</p>
        </div>

        <Card className="shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <InputText
              placeholder="Nombre del nivel (ej. Primero, Segundo, Séptimo)"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="flex-1"
            />
            <Button label="Agregar Nivel" icon="pi pi-plus" className="p-button-success" onClick={crearNivel} />
          </div>
        </Card>

        <Card className="shadow-lg">
          <DataTable
            value={niveles}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            dataKey="ID_nivel"
            globalFilter={globalFilter}
            header={header}
            emptyMessage="No se encontraron niveles."
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="ID_nivel" header="ID" sortable style={{ minWidth: "80px" }} />
            <Column header="Nombre" body={nombreTemplate} sortable style={{ minWidth: "200px" }} />
            <Column header="Acciones" body={accionesTemplate} exportable={false} style={{ minWidth: "150px", textAlign: "center" }} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
