// =============================================================================
// x402 Replay Guard — In-memory deduplication of payment hashes
// =============================================================================

const PROCESSED_PAYMENTS = new Set<string>();
const MAX_ENTRIES = 10_000;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

interface PaymentEntry {
  hash: string;
  timestamp: number;
}

const entries: PaymentEntry[] = [];

/**
 * Check if a payment hash has already been processed.
 * Returns true if it's a duplicate (should be rejected).
 */
export function isDuplicatePayment(paymentHash: string): boolean {
  // Cleanup expired entries
  const now = Date.now();
  while (entries.length > 0 && now - entries[0].timestamp > TTL_MS) {
    const expired = entries.shift();
    if (expired) PROCESSED_PAYMENTS.delete(expired.hash);
  }

  if (PROCESSED_PAYMENTS.has(paymentHash)) {
    return true;
  }

  // Register new payment
  PROCESSED_PAYMENTS.add(paymentHash);
  entries.push({ hash: paymentHash, timestamp: now });

  // Prevent unbounded growth
  if (entries.length > MAX_ENTRIES) {
    const oldest = entries.shift();
    if (oldest) PROCESSED_PAYMENTS.delete(oldest.hash);
  }

  return false;
}
