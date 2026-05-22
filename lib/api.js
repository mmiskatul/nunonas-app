import { Platform } from "react-native";

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  }

  if (Platform.OS === "android") {
    return baseUrl
      .replace("://localhost", "://10.0.2.2")
      .replace("://127.0.0.1", "://10.0.2.2");
  }

  return baseUrl;
}

const API_BASE_URL = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL || "");

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(extractMessage(payload, "Request failed."));
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
