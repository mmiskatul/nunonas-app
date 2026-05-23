import { getSession, restoreSession } from "./auth-session";
import { API_BASE_URL, apiGet, apiPatch, apiPost, apiDelete } from "./api";

async function getAccessToken() {
  const restoredSession = await restoreSession();
  return restoredSession?.accessToken ?? getSession().accessToken;
}

function withAuthorization(headers, accessToken) {
  return {
    ...(headers ?? {}),
    Authorization: `Bearer ${accessToken}`,
  };
}

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

export async function apiGetAuth(path, options = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  return apiGet(path, {
    ...options,
    headers: withAuthorization(options.headers, accessToken),
  });
}

export async function apiPatchAuth(path, body, options = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  return apiPatch(path, body, {
    ...options,
    headers: withAuthorization(options.headers, accessToken),
  });
}

export async function apiPostAuth(path, body, options = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  return apiPost(path, body, {
    ...options,
    headers: withAuthorization(options.headers, accessToken),
  });
}

export async function apiDeleteAuth(path, options = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  return apiDelete(path, {
    ...options,
    headers: withAuthorization(options.headers, accessToken),
  });
}

export async function apiPostAuthForm(path, formData, options = {}) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      headers: withAuthorization(options.headers, accessToken),
      ...options,
    });
  } catch (networkErr) {
    clearTimeout(timeout);
    if (networkErr.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw new Error("Network error. Please check your internet connection.");
  } finally {
    clearTimeout(timeout);
  }

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(extractMessage(payload, `Request failed (${response.status}).`));
  }

  return payload?.data ?? payload;
}
