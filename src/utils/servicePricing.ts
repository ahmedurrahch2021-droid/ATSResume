import type { PricingPackage, ServicePricingRegion } from '../types';

// The existing international rush request remains optional and unconfirmed.
// No Bangladesh rush fee has been approved; never invent a conversion.
export const INTERNATIONAL_RUSH_FEE = 10;

export function packageAmount(pkg: PricingPackage, region: ServicePricingRegion, urgent = false): number {
  return region === 'bangladesh' ? pkg.bangladeshPrice : pkg.price + (urgent ? INTERNATIONAL_RUSH_FEE : 0);
}

export function formatPackagePrice(pkg: PricingPackage, region: ServicePricingRegion, urgent = false): string {
  const amount = packageAmount(pkg, region, urgent).toLocaleString('en-US');
  return `${region === 'bangladesh' ? '৳' : 'US$'}${amount}`;
}

export function describePackagePrices(pkg: PricingPackage): string {
  return `Bangladesh: ${formatPackagePrice(pkg, 'bangladesh')} · International: ${formatPackagePrice(pkg, 'international')}`;
}

export function rushRequestLabel(region: ServicePricingRegion): string {
  return region === 'bangladesh' ? 'Request 12-hour delivery (fee quoted separately)' : 'Request 12-hour delivery (+US$10)';
}

export function rushQuoteNote(region: ServicePricingRegion): string {
  return region === 'bangladesh'
    ? 'Base package price only; any rush fee is quoted separately and must be confirmed before payment.'
    : 'Includes the requested US$10 rush option, subject to availability and confirmation before payment.';
}

/** Only service selections may be restored from the URL, never a supplied price. */
export function serviceSelectionFromSearch(search: URLSearchParams): {
  packageId?: PricingPackage['id'];
  pricingRegion?: ServicePricingRegion;
  urgent?: boolean;
} {
  const packageId = search.get('package');
  const region = search.get('region');
  const urgent = search.get('urgent');
  return {
    packageId: packageId === 'starter' || packageId === 'boost' || packageId === 'full' ? packageId : undefined,
    pricingRegion: region === 'bangladesh' || region === 'international' ? region : undefined,
    urgent: urgent === 'true' ? true : urgent === 'false' ? false : undefined,
  };
}
