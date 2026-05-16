import { DEFAULT_INSTITUTION } from '../data/institution.mock.js';
import { getAvailableLeafs, getTotalLeafsCapacity } from '../utils/leafsMath.js';

const STORAGE_KEY = 'florestas_institution_state_v1';

export function loadInstitution() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_INSTITUTION;
  } catch {
    return DEFAULT_INSTITUTION;
  }
}

export function saveInstitution(institution) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(institution));
  return institution;
}

export function resetInstitution() {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_INSTITUTION;
}

export function acquireTreePackage(institution, treePackage) {
  const next = {
    ...institution,
    acquiredTrees: Number(institution.acquiredTrees || 0) + Number(treePackage.trees || 0),
    leafsPerTree: Number(treePackage.leafsPerTree || institution.leafsPerTree || 1000),
  };
  return saveInstitution(next);
}

export function updateInstitutionPage(institution, pageData) {
  const next = {
    ...institution,
    ...pageData,
    slug: String(pageData.slug || institution.slug)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
  };
  return saveInstitution(next);
}

export function getInstitutionSummary(institution) {
  return {
    totalLeafs: getTotalLeafsCapacity(institution),
    availableLeafs: getAvailableLeafs(institution),
    activitiesCount: institution.activities?.length || 0,
    participants: institution.participants || 0,
  };
}
