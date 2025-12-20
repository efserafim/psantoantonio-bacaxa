/**
 * Utilidades de segurança para armazenamento de dados sensíveis no cliente
 * NOTA: localStorage não é completamente seguro. Para produção, considere:
 * - Usar SessionStorage para tokens de sessão
 * - Implementar refresh tokens com httpOnly cookies
 * - Usar Web Crypto API para criptografia adicional
 */

export class SecureStorage {
  private static readonly PREFIX = "app_";

  /**
   * Armazenar token JWT de forma segura
   */
  static setToken(token: string): void {
    // Usar sessionStorage para maior segurança (limpa ao fechar aba)
    try {
      sessionStorage.setItem(`${this.PREFIX}token`, token);
    } catch (error) {
      console.error("Erro ao armazenar token:", error);
    }
  }

  /**
   * Recuperar token JWT
   */
  static getToken(): string | null {
    try {
      return sessionStorage.getItem(`${this.PREFIX}token`);
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      return null;
    }
  }

  /**
   * Verificar se há token válido armazenado
   */
  static hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  /**
   * Validar estrutura básica do JWT
   */
  static isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      // JWT tem 3 partes separadas por pontos
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Tentar decodificar a payload
      const payload = JSON.parse(atob(parts[1]));

      // Verificar expiração
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; // Converter segundos para ms
        if (Date.now() >= expirationTime) return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remover token
   */
  static removeToken(): void {
    try {
      sessionStorage.removeItem(`${this.PREFIX}token`);
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  }

  /**
   * Armazenar dados de usuário
   */
  static setUser(user: any): void {
    try {
      sessionStorage.setItem(`${this.PREFIX}user`, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao armazenar usuário:", error);
    }
  }

  /**
   * Recuperar dados de usuário
   */
  static getUser(): any {
    try {
      const data = sessionStorage.getItem(`${this.PREFIX}user`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      return null;
    }
  }

  /**
   * Remover dados de usuário
   */
  static removeUser(): void {
    try {
      sessionStorage.removeItem(`${this.PREFIX}user`);
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  }

  /**
   * Limpar todos os dados de autenticação
   */
  static clearAll(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Extrair payload do JWT (sem validar assinatura - só para leitura)
   */
  static getTokenPayload(token: string): any {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      return JSON.parse(atob(parts[1]));
    } catch (error) {
      return null;
    }
  }

  /**
   * Verificar se o token está próximo de expirar (dentro de 5 minutos)
   */
  static isTokenExpiringSoon(token: string): boolean {
    const payload = this.getTokenPayload(token);
    if (!payload || !payload.exp) return false;

    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;
    const fiveMinutesMs = 5 * 60 * 1000;

    return timeUntilExpiry < fiveMinutesMs;
  }
}
