import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { SecureStorage } from "@/lib/secure-storage";

interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Verificar se há token JWT armazenado
    const token = SecureStorage.getToken();

    if (token && SecureStorage.isTokenValid(token)) {
      const adminData = SecureStorage.getUser();
      if (adminData) {
        setAdmin(adminData);
      }
      setIsAuthenticated(true);
    } else {
      // Token inválido ou expirado, limpar
      SecureStorage.clearAll();
      setIsAuthenticated(false);
      setLocation("/admin");
    }
    setIsLoading(false);
  }, [setLocation]);

  const logout = () => {
    SecureStorage.clearAll();
    setIsAuthenticated(false);
    setAdmin(null);
    setLocation("/admin");
  };

  const getAuthToken = (): string | null => {
    return SecureStorage.getToken();
  };

  return { isAuthenticated, isLoading, logout, admin, getAuthToken };
}
