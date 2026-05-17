import { DEFAULT_INSTITUTION } from '../data/institution.mock.js';
import { getAvailableLeafs, getReservedLeafs, getTotalAcquiredTrees, getTotalLeafsCapacity, getTreePackageLeafs } from '../utils/leafsMath.js';

const STORAGE_KEY = 'florestas_institution_state_v1';

export function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || DEFAULT_INSTITUTION.slug;
}

export function normalizeInstitution(raw = {}) {
  const merged = { ...DEFAULT_INSTITUTION, ...raw };
  const purchases = Array.isArray(merged.purchases) ? merged.purchases : [];
  const activities = Array.isArray(merged.activities) ? merged.activities : [];
  const acquiredTrees = Math.max(Number(merged.acquiredTrees || 0), getTotalAcquiredTrees(purchases));
  const leafsCapacity = Math.max(Number(merged.leafsCapacity || 0), getTotalLeafsCapacity({ ...merged, purchases, activities }));

  return {
    ...merged,
    slug: normalizeSlug(merged.slug),
    purchases,
    activities,
    acquiredTrees,
    leafsCapacity,
    textColor: merged.textColor || '#172319',
  };
}

export function loadInstitution() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeInstitution(saved ? JSON.parse(saved) : DEFAULT_INSTITUTION);
  } catch {
    return normalizeInstitution(DEFAULT_INSTITUTION);
  }
}

export function saveInstitution(institution) {
  const normalized = normalizeInstitution(institution);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event('florestas:institution-updated'));
  return normalized;
}

export function resetInstitution() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('florestas:institution-updated'));
  return normalizeInstitution(DEFAULT_INSTITUTION);
}

export function acquireTreePackage(institution, treePackage, protocolResult = {}) {
  const leafsUnlocked = Number(protocolResult?.relayerResult?.institution?.leafsUnlocked || protocolResult?.relayerResult?.leafsUnlocked || getTreePackageLeafs(treePackage));
  const trees = Number(protocolResult?.relayerResult?.institution?.acquiredTrees || protocolResult?.relayerResult?.treeCount || treePackage.trees || treePackage.treeCount || 0);
  const purchase = {
    id: protocolResult?.relayerResult?.purchaseId || `${treePackage.id}-${Date.now()}`,
    packageId: treePackage.id,
    name: treePackage.name,
    trees,
    leafsUnlocked,
    acquiredAt: new Date().toISOString(),
    txHash: protocolResult?.receipt?.txHash || null,
    receiptId: protocolResult?.receipt?.id || null,
  };

  return saveInstitution({
    ...institution,
    purchases: [...(institution.purchases || []), purchase],
    acquiredTrees: Number(institution.acquiredTrees || 0) + trees,
    leafsCapacity: Number(institution.leafsCapacity || 0) + leafsUnlocked,
    leafsPerTree: Number(treePackage.leafsPerTree || institution.leafsPerTree || 1000),
    lastTreePackage: purchase,
    lastProtocolReceipt: protocolResult?.receipt || institution.lastProtocolReceipt || null,
  });
}

export function createInstitutionActivity(institution, activity) {
  const nextActivity = {
    ...activity,
    id: activity.id || `act-${Date.now()}`,
    status: activity.status || 'Disponível',
    participants: Number(activity.participants || 0),
  };
  return saveInstitution({ ...institution, activities: [nextActivity, ...(institution.activities || [])] });
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
  const normalized = normalizeInstitution(institution);
  return {
    totalLeafs: getTotalLeafsCapacity(normalized),
    availableLeafs: getAvailableLeafs(normalized),
    reservedLeafs: getReservedLeafs(normalized),
    distributedLeafs: Number(normalized.distributedLeafs || 0),
    activitiesCount: normalized.activities?.length || 0,
    participants: normalized.participants || 0,
    acquiredTrees: normalized.acquiredTrees || 0,
    canCreateActivities: getAvailableLeafs(normalized) > 0,
    canCustomizePage: (normalized.activities || []).length > 0,
  };
}
