import React from 'react';
import { ExternalLink } from 'lucide-react';
import { sourcesFor } from '../../data/resumeSources';

export function SourceLinks({ ids, detailed = false }: { ids: string[]; detailed?: boolean }) {
  return (
    <ul className={detailed ? 'space-y-4' : 'flex flex-wrap gap-x-4 gap-y-1'} aria-label="Sources">
      {sourcesFor(ids).map((source) => <li key={source.id} className="min-w-0">
        <a href={source.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent underline underline-offset-4">
          {detailed ? source.title : source.publisher}<ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
        </a>
        {detailed && <><p className="text-xs font-medium text-muted">{source.publisher}{source.status === 'further-reading' ? ' · further reading; direct access not verified' : ''}</p><p className="mt-1 text-sm leading-relaxed text-muted">{source.scope}</p></>}
      </li>)}
    </ul>
  );
}
