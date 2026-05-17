export function formatLeafs(value = 0) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(number);
}

export function getTreePackageLeafs(treePackage) {
  if (!treePackage) return 0;
  const trees = Number(treePackage.trees || treePackage.treeCount || 0);
  const leafsPerTree = Number(treePackage.leafsPerTree || 1000);
  return Number(treePackage.leafs || treePackage.totalLeafs || trees * leafsPerTree || 0);
}

export function getTotalAcquiredTrees(purchases = []) {
  return purchases.reduce((total, purchase) => total + Number(purchase.trees || purchase.treeCount || 0), 0);
}

export function getTotalUnlockedLeafs(purchases = []) {
  return purchases.reduce((total, purchase) => {
    const leafs = purchase.leafs ?? purchase.totalLeafs ?? purchase.leafsUnlocked ?? getTreePackageLeafs(purchase);
    return total + Number(leafs || 0);
  }, 0);
}

export function getActivityReservedLeafs(activity) {
  if (!activity) return 0;
  const reward = Number(activity.leafsReward || activity.rewardLeafs || activity.reward || 0);
  const limit = Number(activity.participantLimit || activity.maxParticipants || 0);
  return reward * limit;
}

export function getTotalReservedLeafs(activities = []) {
  return activities.reduce((total, activity) => {
    const isActive = activity.status !== 'encerrada' && activity.status !== 'cancelada';
    return isActive ? total + getActivityReservedLeafs(activity) : total;
  }, 0);
}

export function getTotalDistributedLeafs(activities = []) {
  return activities.reduce((total, activity) => {
    const reward = Number(activity.leafsReward || activity.rewardLeafs || activity.reward || 0);
    const completed = Number(activity.completedParticipants || activity.participants || 0);
    return total + reward * completed;
  }, 0);
}

export function getTotalLeafsCapacity(institutionOrPurchases = {}) {
  const purchases = Array.isArray(institutionOrPurchases)
    ? institutionOrPurchases
    : institutionOrPurchases.purchases || institutionOrPurchases.treePurchases || [];

  const fromPurchases = getTotalUnlockedLeafs(purchases);
  const explicitCapacity = Number(institutionOrPurchases.leafsCapacity || 0);
  const legacyCapacity = Number(institutionOrPurchases.acquiredTrees || 0) * Number(institutionOrPurchases.leafsPerTree || 0);
  return Math.max(fromPurchases, explicitCapacity, legacyCapacity, 0);
}

export function getReservedLeafsFromActivities(activities = []) {
  return getTotalReservedLeafs(activities);
}

export function getReservedLeafs(institutionOrActivities = {}) {
  const activities = Array.isArray(institutionOrActivities)
    ? institutionOrActivities
    : institutionOrActivities.activities || [];
  return getTotalReservedLeafs(activities);
}

export function getAvailableLeafs(institution = {}) {
  const capacity = getTotalLeafsCapacity(institution);
  const reserved = getReservedLeafs(institution);
  const distributed = Number(institution.distributedLeafs || 0);
  return Math.max(capacity - reserved - distributed, 0);
}
