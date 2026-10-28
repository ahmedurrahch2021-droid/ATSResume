import React from 'react';
import type { ServicePricingRegion } from '../types';

interface ServicePricingRegionSelectProps {
  id: string;
  value: ServicePricingRegion;
  onChange: (value: ServicePricingRegion) => void;
}

export function ServicePricingRegionSelect({ id, value, onChange }: ServicePricingRegionSelectProps) {
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium">Pricing region</label>
    <select id={id} className="field" value={value} aria-describedby={`${id}-help`} onChange={(event) => onChange(event.target.value as ServicePricingRegion)}>
      <option value="international">International — USD</option>
      <option value="bangladesh">Bangladesh — BDT</option>
    </select>
    <p id={`${id}-help`} className="text-xs text-muted">Bangladesh prices are fixed in BDT; other-country prices are in USD. Choose your region. No automatic currency conversion or identity check is performed here.</p>
  </div>;
}
