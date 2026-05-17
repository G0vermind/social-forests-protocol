const STORAGE_KEY = 'florestas.activeRoleProfile';

export const ROLE_PROFILES = {
  institution: {
    role: 'institution',
    label: 'Instituição',
    description: 'Compra árvores, recebe Folhas e cria atividades para membros.',
  },
  member: {
    role: 'member',
    label: 'Membro',
    description: 'Participa de atividades, recebe Folhas e evolui seu viveiro.',
  },
  producer: {
    role: 'producer',
    label: 'Produtor',
    description: 'Acompanha ativos reais, lastro biológico e verificações.',
  },
  validator: {
    role: 'validator',
    label: 'Validador',
    description: 'Acesso restrito para perfis previamente autorizados.',
  },
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getActiveRoleProfile() {
  if (!canUseStorage()) return ROLE_PROFILES.institution;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return ROLE_PROFILES.institution;

    const parsed = JSON.parse(stored);
    const role = parsed?.role;

    if (role && ROLE_PROFILES[role]) {
      return ROLE_PROFILES[role];
    }

    return ROLE_PROFILES.institution;
  } catch {
    return ROLE_PROFILES.institution;
  }
}

export function setActiveRoleProfile(roleOrProfile) {
  const role =
    typeof roleOrProfile === 'string'
      ? roleOrProfile
      : roleOrProfile?.role;

  const profile = ROLE_PROFILES[role] || ROLE_PROFILES.institution;

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  return profile;
}

export function clearActiveRoleProfile() {
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAvailableRoleProfiles({ includeValidator = false } = {}) {
  const profiles = Object.values(ROLE_PROFILES);

  if (includeValidator) return profiles;

  return profiles.filter((profile) => profile.role !== 'validator');
}