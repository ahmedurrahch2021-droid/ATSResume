import type { CoverLetterData } from '../types/coverLetter';
import { buildDocumentDocx, downloadBlob, escapeDocumentText, printDocumentHtml } from './resumeExporter';
import { coverLetterFont, coverLetterStyles, getCoverLetterBlocks } from './coverLetterDocument';

export function buildCoverLetterPrintHtml(data: CoverLetterData): string {
  const blocks = getCoverLetterBlocks(data);
  const body = blocks.map((block) => `<div class="letter-block letter-${block.type} letter-${block.id}${block.keepWithNext ? ' letter-keep' : ''}">${block.type === 'bullet' ? '<span class="letter-marker">•</span>' : ''}${escapeDocumentText(block.text)}</div>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeDocumentText(data.sender.fullName || 'Cover letter')}</title><style>@page{size:A4;margin:15.875mm}*{box-sizing:border-box}body{margin:0}${coverLetterStyles(data)}</style></head><body class="cover-letter-document letter-${data.templateStyle}">${body}</body></html>`;
}

export function exportCoverLetterToVectorPdf(data: CoverLetterData): void {
  printDocumentHtml(buildCoverLetterPrintHtml(data), 'Cover letter PDF print document');
}

export function buildCoverLetterDocx(data: CoverLetterData) {
  return buildDocumentDocx(getCoverLetterBlocks(data), { font: coverLetterFont(data), fontSize: data.fontSize === 'compact' ? 10.5 : data.fontSize === 'spacious' ? 12 : 11, accent: data.accentColor, spacing: data.fontSize === 'compact' ? 'compact' : 'standard' });
}

export async function exportCoverLetterToWord(data: CoverLetterData): Promise<void> {
  const bytes = await buildCoverLetterDocx(data);
  const filename = [data.sender.fullName || 'Cover', 'Letter', data.recipient.companyName].filter(Boolean).join('_').replace(/[^\p{L}\p{N}._-]+/gu, '_').slice(0, 100);
  downloadBlob(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), `${filename}.docx`);
}

export function formatCoverLetterPlainText(data: CoverLetterData): string {
  return getCoverLetterBlocks(data).map((block) => `${block.type === 'bullet' ? '• ' : ''}${block.text}`).join('\n\n');
}
