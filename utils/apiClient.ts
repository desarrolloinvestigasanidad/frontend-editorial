// utils/apiClient.ts
"use client";

interface ApiClientOptions {
  method?: string;
  body?: any;
  token?: string; // token alternativo (por impersonación o forzar)
  headers?: Record<string, string>;
}

/**
 * Función para realizar llamadas HTTP a la API.
 * - Usa la URL base de 'NEXT_PUBLIC_API_URL'
 * - Añade el token JWT en 'Authorization: Bearer ...'
 * - Retorna el JSON parseado, o lanza un error en caso no-2xx.
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
) {
  const { method = "GET", body, token, headers = {} } = options;

  // Obtenemos el token (JWT) desde localStorage, si no se envió.
  const authToken =
    token ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : "");

  // URL base
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${baseUrl}${endpoint}`;

  // Armamos los headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // Config para fetch
  const config: RequestInit = {
    method,
    headers: defaultHeaders,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  // Llamada fetch
  const res = await fetch(url, config);

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const dataErr = await res.json();
      errorMsg = dataErr.message || JSON.stringify(dataErr);
    } catch (_) {
      // ignore parse error
    }
    throw new Error(errorMsg);
  }

  // Parse JSON
  return res.json();
}
