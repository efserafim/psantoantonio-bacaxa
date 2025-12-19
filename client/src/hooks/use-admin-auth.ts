import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Redirecionar para login se não autenticado
      setLocation("/admin");
    }
    setIsLoading(false);
  }, [setLocation]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    setLocation("/admin");
  };

  return { isAuthenticated, isLoading, logout };
}
