import Constants from "expo-constants";
import { Platform } from "react-native";

const DEFAULT_BACKEND_BASE_URL = "https://nunos-backend-rho.vercel.app";
const DEFAULT_BACKEND_PORT = "8000";
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function extractHost(candidate) {
  if (!candidate || typeof candidate !== "string") return "";

  const trimmed = candidate.trim();
  if (!trimmed) return "";

  const withoutProtocol = trimmed.includes("://") ? trimmed.split("://")[1] : trimmed;
  const hostWithPort = withoutProtocol.split("/")[0];
  const host = hostWithPort.split(":")[0];

  return host && !LOOPBACK_HOSTS.has(host) ? host : "";
}

function getExpoHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.manifest?.debuggerHost,
    Constants.linkingUri,
  ];

  for (const candidate of candidates) {
    const host = extractHost(candidate);
    if (host) {
      return host;
    }
  }

  return "";
}

function resolveBaseUrl(baseUrl) {
  const configuredBaseUrl = baseUrl?.trim();
  const expoHost = getExpoHost();

  if (!configuredBaseUrl) {
    return DEFAULT_BACKEND_BASE_URL;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(configuredBaseUrl);
  } catch {
    throw new Error("EXPO_PUBLIC_API_BASE_URL must be a valid URL.");
  }

  if (!LOOPBACK_HOSTS.has(parsedUrl.hostname)) {
    return parsedUrl.toString().replace(/\/+$/, "");
  }

  if (configuredBaseUrl.includes("localhost") || configuredBaseUrl.includes("127.0.0.1")) {
    return DEFAULT_BACKEND_BASE_URL;
  }

  if (Platform.OS === "android") {
    if (expoHost) {
      parsedUrl.hostname = expoHost;
    } else {
      parsedUrl.hostname = "10.0.2.2";
    }
  } else if (expoHost) {
    parsedUrl.hostname = expoHost;
  }

  return parsedUrl.toString().replace(/\/+$/, "");
}

export const API_BASE_URL = resolveBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL || "");
export const SOCKET_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function extractMessage(payload, fallback) {
  if (typeof payload?.detail === "string") return payload.detail;
  if (Array.isArray(payload?.detail) && payload.detail.length > 0) {
    const first = payload.detail[0];
    if (typeof first?.msg === "string") {
      return first.msg;
    }
  }
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  return fallback;
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch (networkErr) {
    clearTimeout(timeout);
    if (networkErr.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw new Error(`Network error. Unable to reach ${API_BASE_URL}.`);
  } finally {
    clearTimeout(timeout);
  }

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(extractMessage(payload, `Request failed (${response.status}).`));
  }

  return payload?.data ?? payload;
}

export async function apiGet(path, options = {}) {
  return apiRequest(path, {
    method: "GET",
    ...options,
  });
}

export async function apiPost(path, body, options = {}) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiPatch(path, body, options = {}) {
  return apiRequest(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiDelete(path, options = {}) {
  return apiRequest(path, {
    method: "DELETE",
    ...options,
  });
}
