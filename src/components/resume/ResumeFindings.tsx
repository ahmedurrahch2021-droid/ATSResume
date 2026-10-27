import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { EVIDENCE, gradeLabel } from '../../data/evidence';
import { auditSummary, severityLabel, type AuditReport, type Finding, type Severity } from '../../utils/resumeAudit';
import { EDITOR_SECTIONS, findingTarget, type EditorTarget } from '../../utils/resumeActions';

interface FindingCardProps { finding: Finding; onEdit?: (target: EditorTarget) => void; context?: 'draft' | 'original' }

export function FindingCard({ finding, onEdit, context = 'draft' }: FindingCardProps) {
  const source = finding.sourceId ? EVIDENCE.find((item) => item.id === finding.sourceId) : undefined;
  const target = findingTarget(finding);
  const label = EDITOR_SECTIONS.find((section) => section.id === target.section)?.label ?? 'Original text';
  return (
    <li className="rounded-card border border-line bg-surface p-4 space-y-3" data-finding-id={finding.id}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm leading-snug">{finding.title}</h3>
        <span className={`chip shrink-0 ${finding.severity === 'pass' ? 'bg-success-soft text-success' : finding.severity === 'fix' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'}`}>
          {finding.severity === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />}{severityLabel[finding.severity]}
        </span>
      </div>
      <p className="text-xs text-muted leading-relaxed"><strong className="font-medium text-ink">{context === 'original' ? 'In the original file:' : 'In this draft:'}</strong> {finding.evidence}</p>
      <p className="text-sm text-ink leading-relaxed">{finding.fix}</p>
      <details className="text-xs text-muted">
        <summary className="cursor-pointer min-h-8 py-1 font-medium">Why this is flagged · {finding.id}</summary>
        <div className="pt-2 space-y-2 leading-relaxed">
          {finding.why && <p>{finding.why}</p>}
          {source ? <>
            <p>Evidence {source.grade} · {gradeLabel[source.grade]}</p>
            <p>{source.publicWording}</p>
            {source.caveat && <p>{source.caveat}</p>}
            <p>Register: {source.id}. References: {source.refs.join(', ')}.</p>
          </> : <p>A local text check or review heuristic, not an employer rule or hiring prediction.</p>}
        </div>
      </details>
      {onEdit && finding.severity !== 'pass' && <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-btn border border-line px-3 text-sm font-medium text-accent hover:bg-accent-soft" onClick={() => onEdit(target)}>Open {label.toLowerCase()}<ArrowRight className="w-4 h-4" aria-hidden="true" /></button>}
    </li>
  );
}

interface ResumeFindingsProps { audit: AuditReport; onEdit: (target: EditorTarget) => void; context?: 'draft' | 'original' }

export function ResumeFindings({ audit, onEdit, context = 'draft' }: ResumeFindingsProps) {
  const [filter, setFilter] = useState<'all' | Severity>('all');
  const counts = auditSummary(audit);
  const findings = [...audit.format, ...audit.content];
  const visible = findings.filter((finding) => filter === 'all' || finding.severity === filter);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl">{context === 'original' ? 'Findings from your original upload' : 'Findings for the current draft'}</h2>
          <p className="mt-1 text-sm text-muted">{context === 'original' ? 'Editing rebuilds a new document. It does not modify or re-verify the original file.' : 'Checks update as you edit. An absent prompt is not proof that the resume is perfect.'}</p>
        </div>
        <span className="chip">{counts.toFix} fix · {counts.toCheck} check</span>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Filter findings">
        {([['all', `All ${findings.length}`], ['fix', `Fix ${counts.toFix}`], ['check', `Check ${counts.toCheck}`], ['pass', `Fine ${counts.passed}`]] as const).map(([id, text]) => <button key={id} type="button" aria-pressed={filter === id} className={`min-h-11 rounded-btn border px-3 text-sm ${filter === id ? 'bg-accent-soft border-accent-line text-accent' : 'bg-surface border-line text-muted hover:bg-soft'}`} onClick={() => setFilter(id)}>{text}</button>)}
      </div>
      {visible.length ? <ul className="grid gap-4 md:grid-cols-2">{visible.map((finding) => <FindingCard key={finding.id} finding={finding} onEdit={onEdit} context={context} />)}</ul> : <p className="rounded-card border border-line bg-surface p-5 text-sm text-muted">No findings in this category.</p>}
    </div>
  );
}
