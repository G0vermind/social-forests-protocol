const STORAGE_KEY = 'florestas.activeRoleProfile';

const DEFAULT_PROFILE = {
  role: 'institution',
  label: 'Instituição',
};

const ROLE_LABELS = {
  institution: 'Instituição',
  member: 'Membro',
  producer: 'Produtor',
  validator: 'Validador',
  admin: 'Admin',
};

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizeRoleProfile(profile = {}) {
  const role = profile?.role || DEFAULT_PROFILE.role;

  return {
    ...profile,
    role,
    label: profile?.label || ROLE_LABELS[role] || role,
    updatedAt: profile?.updatedAt || new Date().toISOString(),
  };
}

export function getActiveRoleProfile() {
  if (!canUseLocalStorage()) return DEFAULT_PROFILE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;

    return normalizeRoleProfile(JSON.parse(raw));
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function setActiveRoleProfile(profileOrRole) {
  const nextProfile =
    typeof profileOrRole === 'string'
      ? normalizeRoleProfile({ role: profileOrRole })
      : normalizeRoleProfile(profileOrRole);

  if (canUseLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
  }

  return nextProfile;
}

export function clearActiveRoleProfile() {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return DEFAULT_PROFILE;
}

export function getActiveRole() {
  return getActiveRoleProfile().role;
}

export function setActiveRole(role) {
  return setActiveRoleProfile(role);
}

export const ROLE_PROFILES = [
  { role: 'institution', label: 'Instituição' },
  { role: 'member', label: 'Membro' },
  { role: 'producer', label: 'Produtor' },
  { role: 'validator', label: 'Validador' },
];
