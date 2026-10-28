import React, { useId } from 'react';
import { COUNTRY_PROFILES } from '../../data/targetCountries';
import type { TargetCountry } from '../../types/countryNorms';

export function TargetCountrySelect({ value, onChange, compact = false, className = '', label = 'Target country / region' }: {
  value: TargetCountry; onChange: (country: TargetCountry) => void; compact?: boolean; className?: string; label?: string;
}) {
  const id = useId();
  return <div className={`min-w-0 ${compact ? 'w-full sm:w-64' : 'space-y-2'} ${className}`}>
    <label htmlFor={id} className={`block font-medium ${compact ? 'mb-1 text-xs text-muted' : 'text-sm'}`}>{label}</label>
    <select id={id} className="field" value={value} onChange={(event) => onChange(event.target.value as TargetCountry)}>{COUNTRY_PROFILES.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</select>
  </div>;
}
