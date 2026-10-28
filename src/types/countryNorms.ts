export const TARGET_COUNTRIES = ['global', 'us', 'uk', 'ca', 'au', 'eu', 'gulf', 'bd'] as const;
export type TargetCountry = typeof TARGET_COUNTRIES[number];

export function isTargetCountry(value: unknown): value is TargetCountry {
  return typeof value === 'string' && TARGET_COUNTRIES.includes(value as TargetCountry);
}
