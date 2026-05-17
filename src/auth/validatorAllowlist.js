export const VALIDATOR_ALLOWLIST = [
  // "validador@florestas.social",
];

export function isValidatorAllowed(email) {
  if (!email) return false;
  return VALIDATOR_ALLOWLIST.map((item) => item.toLowerCase()).includes(email.toLowerCase());
}
