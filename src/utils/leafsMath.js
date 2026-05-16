export function getTotalLeafsCapacity(institution) {
  return Number(institution.acquiredTrees || 0) * Number(institution.leafsPerTree || 1000);
}

export function getActivityReservedLeafs(activity) {
  return Number(activity.rewardLeafs || 0) * Number(activity.participantLimit || 0);
}

export function getReservedLeafsFromActivities(activities = []) {
  return activities.reduce((sum, activity) => sum + getActivityReservedLeafs(activity), 0);
}

export function getAvailableLeafs(institution) {
  const total = getTotalLeafsCapacity(institution);
  const reserved = getReservedLeafsFromActivities(institution.activities || []);
  const distributed = Number(institution.distributedLeafs || 0);
  return Math.max(total - reserved - distributed, 0);
}

export function formatLeafs(value) {
  return new Intl.NumberFormat('pt-BR').format(Number(value || 0));
}
