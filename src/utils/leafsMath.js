export function formatLeafs(value = 0) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(number);
}

export function getTreePackageLeafs(treePackage) {
  if (!treePackage) return 0;

  const trees = Number(treePackage.trees || treePackage.treeCount || 0);
  const leafsPerTree = Number(treePackage.leafsPerTree || 1000);

  return trees * leafsPerTree;
}

export function getTotalAcquiredTrees(purchases = []) {
  return purchases.reduce((total, purchase) => {
    return total + Number(purchase.trees || purchase.treeCount || 0);
  }, 0);
}

export function getTotalUnlockedLeafs(purchases = []) {
  return purchases.reduce((total, purchase) => {
    const leafs =
      purchase.leafs ??
      purchase.totalLeafs ??
      getTreePackageLeafs(purchase);

    return total + Number(leafs || 0);
  }, 0);
}

export function getActivityReservedLeafs(activity) {
  if (!activity) return 0;

  const reward = Number(activity.leafsReward || activity.rewardLeafs || 0);
  const limit = Number(activity.participantLimit || activity.maxParticipants || 0);

  return reward * limit;
}

export function getTotalReservedLeafs(activities = []) {
  return activities.reduce((total, activity) => {
    const isActive = activity.status !== "encerrada" && activity.status !== "cancelada";
    return isActive ? total + getActivityReservedLeafs(activity) : total;
  }, 0);
}

export function getTotalDistributedLeafs(activities = []) {
  return activities.reduce((total, activity) => {
    const reward = Number(activity.leafsReward || activity.rewardLeafs || 0);
    const participants = Number(activity.completedParticipants || activity.participants || 0);

    return total + reward * participants;
  }, 0);
}

export function getAvailableLeafs({ purchases = [], activities = [] } = {}) {
  const unlocked = getTotalUnlockedLeafs(purchases);
  const reserved = getTotalReservedLeafs(activities);
  const distributed = getTotalDistributedLeafs(activities);

  return Math.max(unlocked - reserved - distributed, 0);
}

export function getTotalLeafsCapacity(institutionOrPurchases = {}) {
  const purchases = Array.isArray(institutionOrPurchases)
    ? institutionOrPurchases
    : institutionOrPurchases.purchases || institutionOrPurchases.treePurchases || [];

  return getTotalUnlockedLeafs(purchases);
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
