"use client";

import { useState } from "react";
import {
  FaBook,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaHandshake,
} from "react-icons/fa";

interface LinkItem {
  label: string;
  url: string;
}

interface Fase {
  title: string;
  content: string;
}

interface EventItem {
  fecha: string;
  titulo: string;
  color: string;
}

interface BentoCardProps {
  type:
    | "documentacion"
    | "fiscalizacion"
    | "analisis"
    | "fases"
    | "calendario"
    | "reportes";
}

export default function BentoCard({ type }: BentoCardProps) {
  const variants: Record<string, any> = {
    fiscalizacion: {
      title: "Fiscalización",
      description: "Cantidad total de convenios gestionados en SIGEDEP.",
      header: "/icons/documentation.png",
      icon: <FaClipboardList />,
      links: [
        { label: "Ver Seguimientos", url: "/Reporte_Fiscalizacion.pdf" },
        { label: "Ver Registros", url: "/Informe_Fiscalizacion_Completo.pdf" },
        { label: "Registro Nuevo", url: "/registro.pdf" },
      ],
      showPdfIcon: false,
      showDownloadIcon: false,
      linkStyle:
        "bg-[#172951]/10 px-3 py-2 rounded-lg hover:bg-[#172951]/20 transition-all",
      linkTextStyle: "text-[#172951] font-semibold",
      ulExtraSpacing: "mt-5",
    },

    analisis: {
      title: "Análisis Técnico",
      description: "Organizaciones activas en procesos de convenio.",
      header: "/icons/documentation.png",
      icon: <FaHandshake />,
      links: [
        { label: "Ver Resultados", url: "/Analisis_Tecnico.pdf" },
        { label: "Nuevos Análisis", url: "/nuevo-analisis.pdf" },
      ],
      showPdfIcon: false,
      showDownloadIcon: false,
      linkStyle:
        "bg-[#172951]/10 px-3 py-2 rounded-lg hover:bg-[#172951]/20 transition-all",
      linkTextStyle: "text-[#172951] font-semibold",
      ulExtraSpacing: "mt-5",
    },

    documentacion: {
      title: "Documentación",
      description: "Guías y manuales del sistema SIGEDEP.",
      header: "/Documentacion.png",
      icon: <FaBook />,
      links: [
        { label: "Manual de Usuario", url: "/Documentacion_Gantt_2.pdf" },
        { label: "Guía de Acreditaciones", url: "/guia-acreditaciones.pdf" },
        { label: "Procedimiento Interno", url: "/procedimiento.pdf" },
      ],
      showPdfIcon: true,
      showDownloadIcon: true,
      ulExtraSpacing: "mt-10",
    },

    fases: {
      title: "Fases del Proceso",
      description: "Información completa sobre el macroproceso del convenio.",
      header: "/icons/documentation.png",
      icon: <FaFileAlt />,
      showPdfIcon: false,
      showDownloadIcon: false,
      ulExtraSpacing: "mt-5",
      fases: [
        { title: "Fase 1 - Inicio", content: "Descripción detallada de la fase de inicio." },
        { title: "Fase 2 - Evaluación", content: "Descripción de la evaluación del proceso." },
        { title: "Fase 3 - Aprobación", content: "Detalles sobre la aprobación." },
        { title: "Fase 4 - Cierre", content: "Explicación de cómo se cierra el proceso." },
      ],
    },

    calendario: {
      title: "Calendario",
      description: "Fechas importantes y vencimientos próximos.",
      header: "/icons/documentation.png",
      icon: <FaCalendarAlt />,
      proximosEventos: [
        { fecha: "28 Nov", titulo: "Reunión con Proveedor", color: "#3B82F6" },
        { fecha: "30 Nov", titulo: "Informe Trimestral", color: "#F97316" },
        { fecha: "02 Dic", titulo: "Visita de Campo", color: "#10B981" },
        { fecha: "28 Nov", titulo: "Reunión con Proveedor", color: "#3B82F6" },
        { fecha: "30 Nov", titulo: "Informe Trimestral", color: "#F97316" },
        { fecha: "02 Dic", titulo: "Visita de Campo", color: "#10B981" },
        { fecha: "28 Nov", titulo: "Reunión con Proveedor", color: "#3B82F6" },
      ],
      showPdfIcon: false,
      showDownloadIcon: false,
      ulExtraSpacing: "mt-5",
    },

    reportes: {
      title: "Default",
      description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      header: "/icons/documentation.png",
      icon: <FaClipboardList />,
      showPdfIcon: false,
      showDownloadIcon: false,
      ulExtraSpacing: "mt-5",
    },
  };

  const card = variants[type];
  if (!card) return null;

  return (
    <div className="rounded-xl p-6 bg-white/80 backdrop-blur-md shadow border border-gray-200 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1">
      
      {/* HEADER */}
      <div className="w-full min-h-[7rem] rounded-xl bg-gray-100 flex items-center justify-center">
        <img src={card.header} alt="icon" className="w-20 h-20 opacity-40" />
      </div>

      <div className="mt-4 flex items-start gap-3">
        <div className="text-[#CDA95F] text-xl">{card.icon}</div>

        <div className="w-full">
          <h3 className="font-semibold text-[#172951]">{card.title}</h3>
          <p className="text-gray-600 text-sm">{card.description}</p>

          {/* LINKS (si existen) */}
          {card.links && card.links.length > 0 && (
            <ul className={`space-y-2 text-sm ${card.ulExtraSpacing ?? ""}`}>
              {card.links.map((item: LinkItem, idx: number) => (
                <li
                  key={idx}
                  className={`flex items-center justify-between gap-3 group ${
                    card.linkStyle ?? ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {card.showPdfIcon && (
                      <img
                        src="/pdf.png"
                        alt="pdf icon"
                        className="w-6 h-6 opacity-90 group-hover:opacity-100 transition-all"
                      />
                    )}

                    <a
                      className={`transition-colors hover:text-[#CDA95F] ${
                        card.linkTextStyle ?? "text-[#172951]"
                      }`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </div>

                  {card.showDownloadIcon && (
                    <a
                      href={item.url}
                      download
                      className="text-[#172951] hover:text-[#CDA95F] text-xl"
                    >
                      <i className="pi pi-download"></i>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* ACORDEÓN: SOLO FASES */}
          {type === "fases" && card.fases && (
            <div className="mt-4 space-y-2">
              {card.fases.map((fase: Fase, idx: number) => (
                <AccordionItem key={idx} title={fase.title} content={fase.content} />
              ))}
            </div>
          )}

          {/* VISTA PREVIA DEL CALENDARIO */}
          {type === "calendario" && card.proximosEventos && (
            <div className="mt-5 space-y-3">
              <h4 className="text-[#172951] font-semibold text-sm">
                Próximos eventos
              </h4>

              {card.proximosEventos.map((ev: EventItem, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  {/* Color */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ev.color }}
                  ></span>

                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{ev.fecha}</span>
                    <span className="text-sm font-medium text-[#172951]">
                      {ev.titulo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==============================
   COMPONENTE ACORDEÓN
============================== */
function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all"
      >
        <span className="font-medium text-[#172951]">{title}</span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="text-gray-700 text-sm px-4">{content}</div>
      </div>
    </div>
  );
}
