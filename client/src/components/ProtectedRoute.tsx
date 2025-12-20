import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { SecureStorage } from "@/lib/secure-storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = SecureStorage.getToken();
    
    // Verificar se há token e se é válido
    if (token && SecureStorage.isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      // Token inválido ou expirado, limpar storage e redirecionar
      SecureStorage.clearAll();
      setIsAuthenticated(false);
      setLocation("/admin");
    }
    setIsLoading(false);
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
