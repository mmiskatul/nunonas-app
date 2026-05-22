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
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  return fallback;
}

export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(extractMessage(payload, "Request failed."));
  }

  return payload?.data ?? payload;
}
