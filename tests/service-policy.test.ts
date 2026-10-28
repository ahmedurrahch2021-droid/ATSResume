import assert from 'node:assert/strict';
import test from 'node:test';
import { PACKAGES } from '../src/data/mockData';
import { DELIVERY_POLICY, REPLY_POLICY, SERVICE_CONTACT } from '../src/data/servicePolicy';
import { describePackagePrices, formatPackagePrice, packageAmount, rushQuoteNote, serviceSelectionFromSearch } from '../src/utils/servicePricing';

test('approved human-service prices, scopes and revision rounds are not currency conversions', () => {
  assert.deepEqual(PACKAGES.map((pkg) => [pkg.name, pkg.bangladeshPrice, pkg.price, pkg.revisionRounds]), [
    ['Human Resume Review', 499, 10, 1],
    ['Targeted Resume Rewrite', 1999, 35, 1],
    ['Application Kit', 3499, 59, 2],
  ]);
  assert.equal(formatPackagePrice(PACKAGES[1], 'bangladesh'), '৳1,999');
  assert.equal(formatPackagePrice(PACKAGES[2], 'international'), 'US$59');
  assert.match(describePackagePrices(PACKAGES[0]), /Bangladesh: ৳499 · International: US\$10/);
  assert.match(PACKAGES[1].features.join(' '), /Cover letter and LinkedIn wording are not included/);
  assert.match(PACKAGES[2].features.join(' '), /One matching cover letter/);
});

test('service URLs restore approved selections but cannot supply an arbitrary price', () => {
  assert.deepEqual(serviceSelectionFromSearch(new URLSearchParams('package=starter&region=bangladesh&urgent=true')), { packageId: 'starter', pricingRegion: 'bangladesh', urgent: true });
  assert.deepEqual(serviceSelectionFromSearch(new URLSearchParams('package=made-up&region=free&urgent=maybe&price=0')), { packageId: undefined, pricingRegion: undefined, urgent: undefined });
  assert.equal(packageAmount(PACKAGES[0], 'bangladesh'), 499);
});

test('Bangladesh rush requests never invent a BDT surcharge or imply a final total', () => {
  assert.equal(packageAmount(PACKAGES[0], 'bangladesh', true), 499);
  assert.match(rushQuoteNote('bangladesh'), /Base package price only/);
  assert.match(rushQuoteNote('bangladesh'), /quoted separately/);
  assert.equal(packageAmount(PACKAGES[0], 'international', true), 20);
});

test('owner-confirmed WhatsApp uses international digits and the 24-hour policy applies to replies', () => {
  assert.equal(SERVICE_CONTACT.whatsappDisplay, '+8801748755209');
  assert.equal(SERVICE_CONTACT.whatsappUrl, 'https://wa.me/8801748755209');
  assert.equal(new URL(SERVICE_CONTACT.whatsappUrl).search, '');
  assert.match(REPLY_POLICY, /within 24 hours/);
  assert.match(DELIVERY_POLICY, /not a document-delivery deadline/);
});
