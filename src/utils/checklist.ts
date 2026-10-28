import { CHECKLIST_ITEMS } from '../data/mockData';
import { downloadBlob } from './resumeExporter';

export function downloadChecklist(checked: Set<number> = new Set()) {
  const text = `ATS Resume Lab — resume review checklist\n\nManual review prompts, not an ATS score or an employer requirement. Follow the specific application instructions.\n\n${CHECKLIST_ITEMS.map((item) => `[${checked.has(item.id) ? 'x' : ' '}] ${item.title}\n${item.description}`).join('\n\n')}\n\nCheck the exported file at https://atsresumemaker.ai.studio/resume-checker\n`;
  downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'ATS-Resume-Lab-Checklist.txt');
}
