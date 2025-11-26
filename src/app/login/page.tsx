"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import Image from "next/image";
import { Menu } from "primereact/menu";
import { API_BASE } from "@/utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const menuRef = useRef<Menu>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.endsWith("@mep.go.cr")) {
      toast.current?.show({
        severity: "warn",
        summary: "Correo no válido",
        detail: "Solo se permiten correos del dominio mep.go.cr",
        life: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}login/index.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Correo: email, Contrasena: contrasena }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        router.push("/dashboard");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: data.error || "Credenciales incorrectas",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error de red",
        detail: "No se pudo conectar con el servidor",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      {/* Header sin botón de menú */}
      <header className="flex justify-between items-center py-2 px-4  bg-[#12142B] border-none shadow-md">
        <div className="flex items-center space-x-3">
          <Image
            src="/Logo_mep-DORADO.png"
            alt="Ministerio de Educación Pública"
            width={385}
            height={106}
            priority 
          />
        </div>
      </header>

      {/* Formulario de Login */}
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#12142B] to-[#1A1F47] pt-4 px-2 gap-1">
          <Toast ref={toast} />

          {/* Cuadro Izquierdo */}
          <div className="bg-white p-8 rounded-xl shadow-lg w-[792px] h-[900px] flex flex-col items-start gap-3 ">


            <div className="flex-1 w-full p-[60px] pb-2 flex flex-col items-start gap-4">
              <img
                src="/favicon.png"
                alt="Logo"
                width={106}
                height={99}
                className="block"
              />
              <h2 className="text-2xl font-bold text-[#172951]">Bienvenido a SIGEDEP</h2>
              <p className="text-gray-700 leading-relaxed font-extralight italic">
                Bienvenido a SIGEDEP, la plataforma del MEP diseñada para optimizar y centralizar los procesos de la Dirección de Educación Privada.
              </p>
            </div>

            <div className=" flex-1 w-full  py-[10px] px-[60px]">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-[#172951] font-semibold mb-1 leading-5">
                    Correo Electrónico
                  </label>
                  <InputText
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@mep.go.cr"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="flex text-sm text-[#172951] font-semibold mb-1 leading-5">
                    Contraseña
                  </label>
                  <Password
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    feedback={false}
                    toggleMask
                    placeholder="********"
                    inputClassName="w-full p-2 border border-gray-300 rounded-lg"
                    className="w-full !block"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  label={loading ? "Ingresando..." : "Ingresar"}
                  className="w-full h-[50px] bg-[#1d3466] text-white py-2 rounded-lg hover:bg-[#1A1F47] transition-all duration-300 font-semibold "
                  disabled={loading}
                />

                {loading && (
                  <div className="flex justify-center mt-2">
                    <ProgressSpinner />
                  </div>
                )}
              </form>
            </div>


          </div>




          {/* Cuadro Derecho */}
          <div className=" bg-gradient-to-b from-[#F5E6C5] via-[#C2A869] via-[#A2874E] to-[#4E3B1A] p-8 rounded-xl shadow-lg w-[601px] h-[900px] flex justify-center    items-center">
            {/* Contenido del cuadro izquierdo */}

            <img 
              src="costa-rica.svg"
              alt="costa-rica" />
              
          </div>



                

          

      </div>

    </>
  );
}
