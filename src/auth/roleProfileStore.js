const STORAGE_KEY = "fs_role_profile";

export const PUBLIC_ROLES = ["member", "institution", "producer"];

export function getRoleStorageKey(privyUserId = "guest") {
  return `${STORAGE_KEY}:${privyUserId}`;
}

export function loadRoleProfile(privyUserId = "guest") {
  try {
    return JSON.parse(localStorage.getItem(getRoleStorageKey(privyUserId)) || "null");
  } catch {
    return null;
  }
}

export function saveRoleProfile(privyUserId = "guest", profile) {
  localStorage.setItem(getRoleStorageKey(privyUserId), JSON.stringify(profile));
  return profile;
}

export function createDefaultRoleProfile({ activeRole = "member", enabledRoles = ["member"] } = {}) {
  return {
    activeRole,
    enabledRoles: Array.from(new Set(enabledRoles)),
    theme: localStorage.getItem("fs_theme") || "light",
  };
}
