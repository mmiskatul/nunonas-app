import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "./api";

const SESSION_STORAGE_KEY = "nuno_auth_session";

let session = {
  accessToken: null,
  refreshToken: null,
};

export async function hydrateSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return session;
    }
    const parsed = JSON.parse(raw);
    session = {
      accessToken: parsed?.accessToken ?? null,
      refreshToken: parsed?.refreshToken ?? null,
    };
  } catch {
    session = {
      accessToken: null,
      refreshToken: null,
    };
  }
  return session;
}

export async function refreshSession() {
  if (!session.refreshToken) {
    await clearSession();
    return session;
  }

  const nextSession = await apiPost("/api/v1/auth/refresh", {
    refresh_token: session.refreshToken,
  });

  session = {
    accessToken: nextSession?.access_token ?? null,
    refreshToken: nextSession?.refresh_token ?? nextSession?.session_token ?? session.refreshToken,
  };
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function restoreSession() {
  await hydrateSession();

  if (session.accessToken) {
    return session;
  }

  if (!session.refreshToken) {
    await clearSession();
    return session;
  }

  try {
    return await refreshSession();
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    const isExpiredRefresh =
      message.includes("invalid refresh token") ||
      message.includes("user not found") ||
      message.includes("invalid token");

    if (isExpiredRefresh) {
      await clearSession();
    }

    return session;
  }
}

export async function setSession(nextSession) {
  session = {
    accessToken: nextSession?.accessToken ?? null,
    refreshToken: nextSession?.refreshToken ?? nextSession?.sessionToken ?? null,
  };
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession() {
  return session;
}

export async function logoutSession() {
  const refreshToken = session.refreshToken;
  if (refreshToken) {
    try {
      await apiPost("/api/v1/auth/logout", { refresh_token: refreshToken });
    } catch {
      // Best-effort revoke; local session is still cleared below.
    }
  }
  await clearSession();
}

export async function clearSession() {
  session = {
    accessToken: null,
    refreshToken: null,
  };
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
