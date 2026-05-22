import { getSession, restoreSession } from "./auth-session";
import { apiGet, apiPatch } from "./api";

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
