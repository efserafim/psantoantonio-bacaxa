import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChurchIcon, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SecureStorage } from "@/lib/secure-storage";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Acesso bloqueado",
        description: "Muitas tentativas. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Armazenar token JWT de forma segura usando sessionStorage
        SecureStorage.setToken(data.token);
        SecureStorage.setUser(data.admin);
        
        // Resetar tentativas
        setAttempts(0);
        setIsBlocked(false);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo.",
        });
        setLocation("/admin/dashboard");
      } else {
        const errorData = await response.json();
        
        if (response.status === 429) {
          // Rate limited
          setAttempts(5);
          setIsBlocked(true);
          toast({
            title: "Acesso bloqueado",
            description: errorData.message || "Muitas tentativas. Tente novamente mais tarde.",
            variant: "destructive",
          });
        } else {
          // Erro de autenticação
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          if (newAttempts >= 5) {
            setIsBlocked(true);
            toast({
              title: "Acesso bloqueado",
              description: "Muitas tentativas incorretas. Tente novamente mais tarde.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no login",
              description: errorData.message || "Email ou senha incorretos.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary p-3 rounded-full w-fit mb-4">
            <ChurchIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-serif text-2xl">Área Administrativa</CardTitle>
          <CardDescription>
            Paróquia Santo Antônio - Bacaxá
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isBlocked && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Acesso bloqueado por múltiplas tentativas. Tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isBlocked}
                data-testid="input-login-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isBlocked}
                  data-testid="input-login-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            {attempts > 0 && attempts < 5 && (
              <p className="text-sm text-muted-foreground text-center">
                Tentativas restantes: {5 - attempts}
              </p>
            )}
            
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || isBlocked}
              data-testid="button-login-submit"
            >
              {isLoading ? (
                "Entrando..."
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
