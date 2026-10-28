import { resumeLayout } from '../data/resumeLayouts';
import type { ResumeDocumentSettings } from './resumeDocument';

/** Shared paper CSS: browser measurement, preview images and print use the same rules. */
export const RESUME_PAPER_CSS = `
.resume-document{box-sizing:border-box;background:white;color:#20211f;font-size:11pt;line-height:1.4;padding:60px;font-family:var(--resume-font,Arial),sans-serif;overflow-wrap:anywhere}
.resume-document *{box-sizing:border-box}
.resume-block{padding:0 0 4px;white-space:pre-wrap;overflow-wrap:anywhere;break-inside:avoid}
.resume-block-name{font-size:var(--resume-name-size,24pt);font-weight:700;line-height:1.15;color:var(--resume-accent,#8e533c);padding-bottom:7px;break-after:avoid}
.resume-block-title{font-weight:700;padding-bottom:5px;break-after:avoid}
.resume-block-contact{font-size:11pt;line-height:1.4;padding-bottom:3px}
.resume-block-heading{font-size:var(--resume-heading-size,11.5pt);font-weight:700;color:var(--resume-accent,#8e533c);padding-top:13px;padding-bottom:6px;break-after:avoid;text-transform:var(--resume-heading-case,none);border-bottom:var(--resume-heading-rule,0) solid var(--resume-accent,#8e533c);margin:0}
.resume-block-role{font-weight:700;padding-top:7px;padding-bottom:4px;break-after:avoid}
.resume-block-detail{display:block;font-weight:400;font-size:11pt;line-height:1.4}
.resume-block-bullet{position:relative;padding-left:16px}
.resume-bullet-marker{position:absolute;left:2px}
.resume-spacing-compact{line-height:1.25}
.resume-spacing-compact .resume-block-heading{padding-top:10px;padding-bottom:4px}
.resume-spacing-compact .resume-block-role{padding-top:5px}
.resume-layout-classic>[data-block-id="name"],.resume-layout-classic>[data-block-id="title"],.resume-layout-classic>[data-block-id="contact"],.resume-layout-classic>[data-block-id="links"],.resume-layout-classic>[data-block-id="work-rights"]{text-align:center}
.resume-identity{position:relative;min-height:96px;padding-right:112px;padding-bottom:8px;break-inside:avoid}
.resume-identity-photo{position:absolute;right:0;top:0;width:80px;height:80px;object-fit:cover}
.resume-identity-text{text-align:left;min-width:0}
.resume-block-photo{padding:8px 0}.resume-block-photo img{width:80px;height:80px;object-fit:cover}
`;

export function resumePaperStyle(settings: ResumeDocumentSettings): Record<string, string> {
  const layout = resumeLayout(settings.layout);
  const font = ['Arial', 'Calibri', 'Georgia'].includes(settings.font) ? settings.font : 'Arial';
  return {
    '--resume-font': font,
    '--resume-accent': /^#[0-9a-f]{6}$/i.test(settings.accent) ? settings.accent : '#20211f',
    '--resume-name-size': `${layout.nameSize}pt`,
    '--resume-heading-size': `${layout.headingSize}pt`,
    '--resume-heading-case': layout.headingCaps ? 'uppercase' : 'none',
    '--resume-heading-rule': layout.headingRule ? '0.6pt' : '0',
  };
}

export function resumePaperClass(settings: ResumeDocumentSettings): string {
  return `resume-document resume-layout-${resumeLayout(settings.layout).id} resume-spacing-${settings.spacing === 'compact' ? 'compact' : 'standard'}`;
}
