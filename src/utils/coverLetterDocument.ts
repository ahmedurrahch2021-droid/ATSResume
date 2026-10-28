import type { CoverLetterData } from '../types/coverLetter';
import type { ResumeDocumentBlock } from './resumeDocument';

export function createEmptyCoverLetter(): CoverLetterData {
  return {
    id: 'cl-blank', title: '', sender: { fullName: '', jobTitle: '', email: '', phone: '', location: '', portfolioUrl: '', linkedInUrl: '' },
    recipient: { hiringManagerName: '', companyName: '', department: '', companyAddress: '' },
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    salutation: 'Dear Hiring Team,', opening: '', bodyParagraphs: [''], keyHighlights: [], closing: '', signOff: 'Sincerely,',
    templateStyle: 'modern', accentColor: '#8e533c', fontFamily: 'sans', fontSize: 'standard',
  };
}

export function isCoverLetterData(value: unknown): value is CoverLetterData {
  if (!value || typeof value !== 'object') return false;
  const data = value as CoverLetterData;
  const isString = (item: unknown) => typeof item === 'string';
  if (!['id', 'title', 'date', 'salutation', 'opening', 'closing', 'signOff', 'accentColor'].every((key) => isString(data[key as keyof CoverLetterData]))) return false;
  if (!data.sender || !['fullName', 'jobTitle', 'email', 'phone', 'location'].every((key) => isString(data.sender[key as keyof CoverLetterData['sender']]))) return false;
  if (![data.sender.portfolioUrl, data.sender.linkedInUrl].every((item) => item === undefined || isString(item))) return false;
  if (!data.recipient || !isString(data.recipient.hiringManagerName) || !isString(data.recipient.companyName)) return false;
  if (![data.recipient.department, data.recipient.companyAddress].every((item) => item === undefined || isString(item))) return false;
  return Array.isArray(data.bodyParagraphs) && data.bodyParagraphs.every(isString) && Array.isArray(data.keyHighlights) && data.keyHighlights.every(isString)
    && ['modern', 'classic', 'minimal', 'executive'].includes(data.templateStyle) && ['sans', 'serif', 'mono'].includes(data.fontFamily) && ['compact', 'standard', 'spacious'].includes(data.fontSize);
}

export function getCoverLetterBlocks(data: CoverLetterData): ResumeDocumentBlock[] {
  const blocks: ResumeDocumentBlock[] = [];
  const add = (id: string, type: ResumeDocumentBlock['type'], text: string, keepWithNext = false) => { if (text.trim()) blocks.push({ id, type, text: text.trim(), keepWithNext }); };
  add('name', 'name', data.sender.fullName, true);
  add('title', 'title', data.sender.jobTitle, true);
  add('contact', 'contact', [data.sender.email, data.sender.phone, data.sender.location].filter(Boolean).join(' | '));
  add('links', 'contact', [data.sender.portfolioUrl, data.sender.linkedInUrl].filter(Boolean).join(' | '));
  add('date', 'paragraph', data.date);
  add('recipient', 'paragraph', [data.recipient.hiringManagerName, data.recipient.department, data.recipient.companyName, data.recipient.companyAddress].filter(Boolean).join('\n'), true);
  add('salutation', 'paragraph', data.salutation, true);
  add('opening', 'paragraph', data.opening);
  data.bodyParagraphs.forEach((paragraph, index) => add(`body-${index}`, 'paragraph', paragraph));
  data.keyHighlights.forEach((highlight, index) => add(`highlight-${index}`, 'bullet', highlight));
  add('closing', 'paragraph', data.closing);
  add('sign-off', 'paragraph', data.signOff, true);
  add('signature', 'title', data.sender.fullName);
  return blocks;
}

export function coverLetterFont(data: CoverLetterData) {
  return data.fontFamily === 'serif' ? 'Georgia' : data.fontFamily === 'mono' ? 'Courier New' : 'Arial';
}

/** Used in both the paper preview and the isolated print document. */
export function coverLetterStyles(data: CoverLetterData): string {
  const accent = /^#[0-9a-f]{6}$/i.test(data.accentColor) ? data.accentColor : '#8e533c';
  const size = data.fontSize === 'compact' ? '10.5pt' : data.fontSize === 'spacious' ? '12pt' : '11pt';
  return `.cover-letter-document{box-sizing:border-box;background:#fff;color:#20211f;font-family:"${coverLetterFont(data)}",serif;font-size:${size};line-height:1.45;overflow-wrap:anywhere}.letter-block{white-space:pre-wrap;margin:0 0 12px;break-inside:avoid}.letter-name{font-size:20pt;font-weight:700;line-height:1.2;color:${accent};margin-bottom:6px}.letter-title{font-weight:700;margin-bottom:6px}.letter-contact{font-size:10pt;margin-bottom:6px}.letter-bullet{padding-left:18px;position:relative;margin-bottom:6px}.letter-marker{position:absolute;left:2px}.letter-date{margin-top:22px}.letter-keep{break-after:avoid}.letter-classic .letter-name,.letter-classic .letter-contact,.letter-classic .letter-title{text-align:center}.letter-executive .letter-name{border-left:4px solid ${accent};padding-left:12px}.letter-minimal .letter-name{font-size:17pt}.letter-modern .letter-contact:last-of-type{padding-bottom:6px}`;
}
