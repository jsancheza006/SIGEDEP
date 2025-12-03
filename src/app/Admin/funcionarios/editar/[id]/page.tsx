"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AtSign,
  Briefcase,
  Lock,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Marca esta ruta como dinámica
export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { API_BASE } from "@/utils/api";

const funcionarioSchema = z.object({
  cedula: z.string().min(1, "Cédula es requerida"),
  nombre: z.string().min(1, "Nombre es requerido"),
  apellidos: z.string().min(1, "Apellidos son requeridos"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(1, "Teléfono es requerido"),
  contrasena: z.string().optional(),
  rol: z.enum(["Admin", "Funcionario"]).optional(),
});

type FuncionarioFormValues = z.infer<typeof funcionarioSchema>;

function EditarFuncionarioForm({ id }: { id: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: {
      cedula: "",
      nombre: "",
      apellidos: "",
      correo: "",
      telefono: "",
      rol: "Funcionario",
      contrasena: "",
    },
  });

  useEffect(() => {
    cargarDatosFuncionario();
  }, [id]);

  const cargarDatosFuncionario = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}Funcionario/index.php?id=${id}`);
      const data = await response.json();

      if (data && data.ID_Funcionario) {
        form.reset({
          cedula: String(data.ID_Funcionario),
          nombre: data.Nombre,
          apellidos: data.Apellido,
          correo: data.Correo,
          telefono: String(data.Numero),
          rol: data.Rol || data.rol || "Funcionario",
          contrasena: "",
        });
      } else {
        toast({
          title: "Error",
          description: "No se encontró el funcionario",
          variant: "destructive",
        });
        router.push("/Admin/funcionarios");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del funcionario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: FuncionarioFormValues) {
    setIsSubmitting(true);
    
    try {
      const payload: any = {
        Nombre: data.nombre,
        Apellido: data.apellidos,
        Correo: data.correo,
        Numero: data.telefono,
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (data.contrasena && data.contrasena.length > 0) {
        payload.Contrasena = data.contrasena;
      }

      // Incluir Rol (permite cambiar rol desde el formulario de edición)
      if (data.rol) {
        payload.Rol = data.rol;
      }

      const response = await fetch(`${API_BASE}Funcionario/index.php?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Lee la respuesta como texto primero
      const responseText = await response.text();
      
      // Intenta parsear como JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error("Respuesta del servidor:", responseText);
        throw new Error("El servidor no devolvió un JSON válido.");
      }

      // La API retorna {message: "..."} en éxito o {error: "..."} en error
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.message) {
        toast({
          title: "Funcionario Actualizado",
          description: result.message,
        });
        router.push("/Admin/funcionarios");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el funcionario.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-sm sm:text-base text-gray-600">Cargando datos del funcionario...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">
          Editar Funcionario
        </CardTitle>
        <CardDescription>
          Modifique los campos necesarios. Deje la contraseña en blanco si no desea cambiarla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ej: 1-2345-6789"
                          {...field}
                          className="pl-10 bg-gray-100"
                          disabled
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ingrese el nombre"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ingrese los apellidos"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="ejemplo@mep.go.cr"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Ej: 8888-8888"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                  <FormField
                    control={form.control}
                    name="rol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border border-gray-300 rounded-lg">
                            <option value="Funcionario">Funcionario</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="contrasena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva Contraseña (opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="Dejar en blanco para mantener la actual"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/Admin/funcionarios")}
                >
                  Cancelar
                </Button>
              </div>

              <div className="w-full sm:w-auto">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function EditarFuncionarioPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mb-6 px-2 sm:px-0">
        <a
          href="/Admin/funcionarios"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-4"
        >
          <i className="pi pi-arrow-left mr-2"></i>
          Volver a Lista de Funcionarios
        </a>
      </div>
      <EditarFuncionarioForm id={id} />
    </main>
  );
}
