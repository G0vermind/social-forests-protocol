import { DEFAULT_INSTITUTION } from '../data/institution.mock.js';
import { getAvailableLeafs, getReservedLeafs, getTotalLeafsCapacity } from '../utils/leafsMath.js';

const STORAGE_KEY = 'florestas_institution_state_v1';

export function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || DEFAULT_INSTITUTION.slug;
}

export function loadInstitution() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_INSTITUTION, ...JSON.parse(saved) } : DEFAULT_INSTITUTION;
  } catch {
    return DEFAULT_INSTITUTION;
  }
}

export function saveInstitution(institution) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(institution));
  window.dispatchEvent(new Event('florestas:institution-updated'));
  return institution;
}

export function resetInstitution() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('florestas:institution-updated'));
  return DEFAULT_INSTITUTION;
}

export function acquireTreePackage(institution, treePackage) {
  return saveInstitution({
    ...institution,
    acquiredTrees: Number(institution.acquiredTrees || 0) + Number(treePackage.trees || 0),
    leafsPerTree: Number(treePackage.leafsPerTree || institution.leafsPerTree || 1000),
  });
}

export function updateInstitutionPage(institution, pageData) {
  return saveInstitution({
    ...institution,
    ...pageData,
    slug: normalizeSlug(pageData.slug || institution.slug),
    logo: String(pageData.logo || pageData.name || institution.name || 'IV').slice(0, 4).toUpperCase(),
  });
}

export function publishInstitutionPage(institution) {
  return saveInstitution({ ...institution, pagePublished: true });
}

export function getInstitutionPublicUrl(institution) {
  return `/i/${normalizeSlug(institution.slug)}`;
}

export function getInstitutionPublicLink(institution) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${getInstitutionPublicUrl(institution)}`;
}

export function getInstitutionSummary(institution) {
  return {
    totalLeafs: getTotalLeafsCapacity(institution),
    availableLeafs: getAvailableLeafs(institution),
    reservedLeafs: getReservedLeafs(institution),
    distributedLeafs: Number(institution.distributedLeafs || 0),
    activitiesCount: institution.activities?.length || 0,
    participants: institution.participants || 0,
  };
}
