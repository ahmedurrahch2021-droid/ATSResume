import React from 'react';

interface ResumeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'url';
  rows?: number;
}

export function ResumeField({ id, label, value, onChange, hint, placeholder, type = 'text', rows }: ResumeFieldProps) {
  const common = { id, value, placeholder, 'aria-describedby': hint ? `${id}-hint` : undefined, className: 'field', onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return (
    <div className="space-y-1.5 min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-ink">{label}</label>
      {rows ? <textarea {...common} rows={rows} /> : <input {...common} type={type} />}
      {hint && <p id={`${id}-hint`} className="text-xs text-muted leading-relaxed">{hint}</p>}
    </div>
  );
}
