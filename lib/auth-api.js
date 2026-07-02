import { getSession, refreshSession, restoreSession } from "./auth-session";
import { API_BASE_URL } from "./api";

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

async function authRequest(path, options = {}, retryOnUnauthorized = true) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: withAuthorization(
      {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      accessToken,
    ),
  });

  const payload = await readJson(response);
  if (response.status === 401 && retryOnUnauthorized) {
    const refreshedSession = await refreshSession();
    if (refreshedSession?.accessToken) {
      return authRequest(path, options, false);
    }
  }

  if (!response.ok) {
    throw new Error(extractMessage(payload, `Request failed (${response.status}).`));
  }

  return payload?.data ?? payload;
}

export async function apiGetAuth(path, options = {}) {
  return authRequest(path, {
    method: "GET",
    ...options,
  });
}

export async function apiPatchAuth(path, body, options = {}) {
  return authRequest(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiPostAuth(path, body, options = {}) {
  return authRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiDeleteAuth(path, options = {}) {
  return authRequest(path, {
    method: "DELETE",
    ...options,
  });
}

export async function apiPostAuthForm(path, formData, options = {}, retryOnUnauthorized = true) {
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
  if (response.status === 401 && retryOnUnauthorized) {
    const refreshedSession = await refreshSession();
    if (refreshedSession?.accessToken) {
      return apiPostAuthForm(path, formData, options, false);
    }
  }

  if (!response.ok) {
    throw new Error(extractMessage(payload, `Request failed (${response.status}).`));
  }

  return payload?.data ?? payload;
}
