import { SecureStorage } from "./secure-storage";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Função para fazer requisições autenticadas com JWT
 */
export async function authenticatedFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const token = SecureStorage.getToken();
  
  if (!token) {
    throw new Error("Sem autenticação. Faça login para continuar.");
  }

  if (!SecureStorage.isTokenValid(token)) {
    // Token inválido ou expirado
    SecureStorage.clearAll();
    window.location.href = "/admin";
    throw new Error("Token expirado. Faça login novamente.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, fetchOptions);
}

/**
 * Função auxiliar para fazer requisições POST autenticadas
 */
export async function authenticatedPost(
  url: string,
  data?: any,
  options?: FetchOptions
) {
  return authenticatedFetch(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Função auxiliar para fazer requisições PUT autenticadas
 */
export async function authenticatedPut(
  url: string,
  data?: any,
  options?: FetchOptions
) {
  return authenticatedFetch(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Função auxiliar para fazer requisições DELETE autenticadas
 */
export async function authenticatedDelete(
  url: string,
  options?: FetchOptions
) {
  return authenticatedFetch(url, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Função auxiliar para fazer requisições autenticadas com FormData (para uploads)
 */
export async function authenticatedFetchFormData(
  url: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST"
): Promise<Response> {
  const token = SecureStorage.getToken();

  if (!token) {
    throw new Error("Sem autenticação. Faça login para continuar.");
  }

  if (!SecureStorage.isTokenValid(token)) {
    SecureStorage.clearAll();
    window.location.href = "/admin";
    throw new Error("Token expirado. Faça login novamente.");
  }

  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}
