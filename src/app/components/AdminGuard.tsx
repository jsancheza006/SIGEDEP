"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated");
      const role = localStorage.getItem("userRole");

      if (!isAuth || role !== "admin") {
        router.push("/login");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <ProgressSpinner />
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
