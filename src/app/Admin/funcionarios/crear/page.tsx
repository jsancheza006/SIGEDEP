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
import { useState } from "react";

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
  contrasena: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["Admin", "Funcionario"]).optional(),
});

type FuncionarioFormValues = z.infer<typeof funcionarioSchema>;

function FormularioFuncionario() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  async function onSubmit(data: FuncionarioFormValues) {
    setIsSubmitting(true);
    
    try {
      const payload = {
        ID_Funcionario: data.cedula,
        Nombre: data.nombre,
        Apellido: data.apellidos,
        Correo: data.correo,
        Numero: data.telefono,
        Contrasena: data.contrasena,
        Rol: data.rol, 
      };

      const response = await fetch(`${API_BASE}Funcionario/index.php`, {
        method: "POST",
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
        throw new Error("El servidor no devolvió un JSON válido. Revisa la consola para ver la respuesta completa.");
      }

      // La API retorna {message: "...", id: ...} en caso exitoso
      // O {error: "..."} en caso de error
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.message) {
        toast({
          title: "Funcionario Guardado",
          description: result.message,
        });
        form.reset();
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el funcionario. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          Insertar Nuevo Funcionario
        </CardTitle>
        <CardDescription>
          Rellene los campos para registrar un nuevo funcionario.
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
                          className="pl-10"
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
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="********"
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

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar Funcionario"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function FormularioFuncionarioPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-8">
      <div className="w-full max-w-4xl mb-6">
        <a 
          href="/Admin/funcionarios" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-4"
        >
          <i className="pi pi-arrow-left mr-2"></i>
          Volver a Gestión de Funcionarios
        </a>
      </div>
      <FormularioFuncionario />
    </main>
  );
}
