import type { ResumeData } from '../types';
import { DEFAULT_DOCUMENT_SETTINGS, documentPlainText, getResumeDocumentBlocks, type ResumeDocumentBlock, type ResumeDocumentSettings } from './resumeDocument';
import { resumeLayout } from '../data/resumeLayouts';
import { RESUME_PAPER_CSS, resumePaperClass, resumePaperStyle } from './resumeStyles';
import { photoCropXml } from './photoCrop';
import { pagesForDocument } from './resumePagination';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function escapeDocumentText(text: string): string {
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function resumeFilename(resume: ResumeData): string {
  return (resume.fullName || 'resume').replace(/[^\p{L}\p{N}._-]+/gu, '_').slice(0, 80) || 'resume';
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadResumeText(resume: ResumeData, settings: ResumeDocumentSettings = DEFAULT_DOCUMENT_SETTINGS): void {
  downloadBlob(new Blob([documentPlainText(resume, settings)], { type: 'text/plain;charset=utf-8' }), `${resumeFilename(resume)}_resume.txt`);
}

/** Real OPC/DOCX package. All text is in the body; only an enabled photo is anchored. */
export async function buildResumeDocx(resume: ResumeData, settings: ResumeDocumentSettings = DEFAULT_DOCUMENT_SETTINGS, measuredPages?: ResumeDocumentBlock[][]): Promise<Uint8Array<ArrayBuffer>> {
  return buildDocumentDocx(getResumeDocumentBlocks(resume, resume.targetMarket ?? 'global', settings.layout), settings, measuredPages);
}

/** Shared paragraph/list package writer for resumes and cover letters. */
export async function buildDocumentDocx(blocks: ResumeDocumentBlock[], settings: Omit<ResumeDocumentSettings, 'font'> & { font: string; fontSize?: number } = DEFAULT_DOCUMENT_SETTINGS, measuredPages?: ResumeDocumentBlock[][]): Promise<Uint8Array<ArrayBuffer>> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const accent = /^#[0-9a-f]{6}$/i.test(settings.accent) ? settings.accent.slice(1) : '8e533c';
  const font = ['Arial', 'Calibri', 'Georgia', 'Courier New'].includes(settings.font) ? settings.font : 'Arial';
  const halfPoints = Math.round((settings.fontSize && settings.fontSize >= 8 && settings.fontSize <= 20 ? settings.fontSize : 11) * 2);
  const layout = settings.layout ? resumeLayout(settings.layout) : undefined;
  const nameSize = (layout?.nameSize ?? 20) * 2;
  const headingSize = (layout?.headingSize ?? 12) * 2;
  const pages = pagesForDocument(blocks, measuredPages);
  const compact = settings.spacing === 'compact';
  const line = compact ? 300 : 336;
  let photoExtension = '';
  const photoBlock = blocks.find((block) => block.type === 'identity' || block.type === 'photo');
  const photoData = photoBlock?.photo ?? photoBlock?.text ?? '';
  const photo = photoData.match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
  if (photo) {
    photoExtension = photo[1] === 'jpeg' ? 'jpg' : 'png';
    zip.file(`word/media/photo.${photoExtension}`, photo[2], { base64: true });
  }
  const run = (text: string) => `<w:r><w:t xml:space="preserve">${escapeDocumentText(text)}</w:t></w:r>`;
  const drawing = (anchored: boolean) => {
    if (!photoExtension) return '';
    const picture = `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="Optional resume photo"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdPhoto"/>${photoCropXml(photoData)}<a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="762000" cy="762000"/></a:xfrm><a:prstGeom prst="${photoBlock?.photoShape === 'circle' ? 'ellipse' : 'rect'}"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>`;
    return `<w:r><w:drawing>${anchored ? `<wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="0" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="0"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="margin"><wp:align>right</wp:align></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV><wp:extent cx="762000" cy="762000"/><wp:wrapNone/><wp:docPr id="1" name="Optional resume photo"/>${picture}</wp:anchor>` : `<wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="762000" cy="762000"/><wp:docPr id="1" name="Optional resume photo"/>${picture}</wp:inline>`}</w:drawing></w:r>`;
  };
  const paragraph = (block: ResumeDocumentBlock, identity = false, attachPhoto = false, pageBreakBefore = false): string => {
    if (block.type === 'identity') {
      const children = block.children?.length ? block.children : [{ id: 'photo-anchor', type: 'paragraph' as const, text: '' }];
      const minimumTextHeight = children.reduce((height, child) => height + (child.type === 'name' ? (layout?.nameSize ?? 20) * 1.15 + 5.25 : child.type === 'contact' ? 11 * 1.4 + 2.25 : 11 * (compact ? 1.25 : 1.4) + (child.type === 'title' ? 3.75 : 3)), 0);
      const remaining = Math.max(0, 72 - minimumTextHeight);
      return children.map((child, index) => paragraph({ ...child, keepWithNext: true }, true, index === 0, pageBreakBefore && index === 0)).join('') + (remaining > 0 ? `<w:p><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="${Math.ceil(remaining * 20)}" w:lineRule="exact"/></w:pPr></w:p>` : '');
    }
    if (block.type === 'photo') {
      if (!photoExtension) return '';
      return `<w:p>${drawing(false)}</w:p>`;
    }
    const style = block.type === 'name' ? 'ResumeName' : block.type === 'heading' ? 'Heading1' : block.type === 'role' ? 'ResumeRole' : block.type === 'title' ? 'ResumeTitle' : block.type === 'contact' ? 'ResumeContact' : 'Normal';
    const list = block.type === 'bullet' ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : '';
    const alignment = identity ? '<w:ind w:right="1680"/><w:jc w:val="left"/>' : layout?.centredIdentity && ['name', 'title', 'contact'].includes(block.type) && ['name', 'title', 'contact', 'links', 'work-rights'].includes(block.id) ? '<w:jc w:val="center"/>' : '';
    const detail = block.detail ? `<w:r><w:br/></w:r><w:r><w:rPr><w:b w:val="0"/><w:sz w:val="${halfPoints}"/><w:color w:val="20211f"/></w:rPr><w:t xml:space="preserve">${escapeDocumentText(block.detail)}</w:t></w:r>` : '';
    return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${block.keepWithNext ? '<w:keepNext/>' : ''}<w:keepLines/>${pageBreakBefore ? '<w:pageBreakBefore/>' : ''}${list}${alignment}</w:pPr>${attachPhoto ? drawing(true) : ''}${block.text.split('\n').map((line, index) => `${index ? '<w:r><w:br/></w:r>' : ''}${run(line)}`).join('')}${detail}</w:p>`;
  };
  const xmlStart = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const body = pages.map((page, pageIndex) => page.map((block, blockIndex) => paragraph(block, false, false, pageIndex > 0 && blockIndex === 0)).join('')).join('');
  zip.file('word/document.xml', `${xmlStart}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="0" w:footer="0"/></w:sectPr></w:body></w:document>`);
  zip.file('word/styles.xml', `${xmlStart}<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}" w:cs="${font}"/><w:sz w:val="${halfPoints}"/><w:szCs w:val="${halfPoints}"/><w:color w:val="20211f"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="${line}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
    <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
    <w:style w:type="paragraph" w:styleId="ResumeName"><w:name w:val="Resume Name"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="105" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:b/><w:sz w:val="${nameSize}"/><w:color w:val="${accent}"/></w:rPr></w:style>
    <w:style w:type="paragraph" w:styleId="ResumeTitle"><w:name w:val="Resume Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="75"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>
    <w:style w:type="paragraph" w:styleId="ResumeRole"><w:name w:val="Resume Role"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="${compact ? 75 : 105}" w:after="60"/></w:pPr><w:rPr><w:b/></w:rPr></w:style>
    <w:style w:type="paragraph" w:styleId="ResumeContact"><w:name w:val="Contact"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="45" w:line="336" w:lineRule="auto"/></w:pPr></w:style>
    <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/>${layout?.headingRule ? `<w:pBdr><w:bottom w:val="single" w:sz="5" w:space="0" w:color="${accent}"/></w:pBdr>` : ''}<w:spacing w:before="${compact ? 150 : 195}" w:after="${compact ? 60 : 90}"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/>${layout?.headingCaps ? '<w:caps/>' : ''}<w:color w:val="${accent}"/><w:sz w:val="${headingSize}"/></w:rPr></w:style>
  </w:styles>`);
  zip.file('word/numbering.xml', `${xmlStart}<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="240"/></w:tabs><w:ind w:left="240" w:hanging="180"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  zip.file('_rels/.rels', `${xmlStart}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file('word/_rels/document.xml.rels', `${xmlStart}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>${photoExtension ? `<Relationship Id="rIdPhoto" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/photo.${photoExtension}"/>` : ''}</Relationships>`);
  zip.file('[Content_Types].xml', `${xmlStart}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${photoExtension ? `<Default Extension="${photoExtension}" ContentType="image/${photoExtension === 'jpg' ? 'jpeg' : 'png'}"/>` : ''}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`);
  const bytes = new Uint8Array(await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' }));
  if (bytes.byteLength > 2.5 * 1024 * 1024) throw new Error('This export exceeds 2.5 MB. Remove the photo or use a smaller image, then try again.');
  return bytes;
}

export async function downloadResumeDocx(resume: ResumeData, settings: ResumeDocumentSettings, pages?: ResumeDocumentBlock[][]): Promise<void> {
  const bytes = await buildResumeDocx(resume, settings, pages);
  downloadBlob(new Blob([bytes], { type: DOCX_MIME }), `${resumeFilename(resume)}_resume.docx`);
}

export function buildResumePrintHtml(resume: ResumeData, settings: ResumeDocumentSettings, measuredPages?: ResumeDocumentBlock[][]): string {
  const blocks = getResumeDocumentBlocks(resume, resume.targetMarket ?? 'global', settings.layout);
  const pages = pagesForDocument(blocks, measuredPages);
  const render = (block: ResumeDocumentBlock): string => block.type === 'identity'
    ? `<div class="resume-identity" data-block-id="${escapeDocumentText(block.id)}"><div class="resume-identity-text">${(block.children ?? []).map(render).join('')}</div><img class="resume-identity-photo" alt="Optional resume photo" src="${escapeDocumentText(block.photo ?? '')}" style="border-radius:${block.photoShape === 'circle' ? '50%' : '0'}"></div>`
    : block.type === 'photo' ? `<div class="resume-block-photo"><img alt="Resume photo" src="${escapeDocumentText(block.text)}"></div>`
    : `<div class="resume-block resume-block-${block.type}" data-block-id="${escapeDocumentText(block.id)}">${block.type === 'bullet' ? '<span class="resume-bullet-marker">•</span>' : ''}<span>${escapeDocumentText(block.text).replace(/\n/g, '<br>')}</span>${block.detail ? `<span class="resume-block-detail">${escapeDocumentText(block.detail)}</span>` : ''}</div>`;
  const style = Object.entries(resumePaperStyle(settings)).map(([key, value]) => `${key}:${value}`).join(';');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeDocumentText(resume.fullName || 'Resume')}</title><style>@page{size:A4;margin:15.875mm}body{margin:0;background:white}.page{width:210mm;min-height:297mm;break-after:page}.page:last-child{break-after:auto}${RESUME_PAPER_CSS}@media print{.page{width:auto;min-height:0;padding:0}}</style></head><body>${pages.map((page) => `<article class="page ${resumePaperClass(settings)}" style="${style}">${page.map(render).join('')}</article>`).join('')}</body></html>`;
}

/** The browser supplies the PDF text layer. No popup or external rendering service. */
export function printResume(resume: ResumeData, settings: ResumeDocumentSettings, pages?: ResumeDocumentBlock[][]): void {
  printDocumentHtml(buildResumePrintHtml(resume, settings, pages), 'Resume PDF print document');
}

export function printDocumentHtml(html: string, title: string): void {
  const frame = document.createElement('iframe');
  frame.title = title;
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('sandbox', 'allow-same-origin allow-modals');
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;';
  frame.onload = () => {
    const printWindow = frame.contentWindow;
    if (!printWindow) { frame.remove(); return; }
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
    printWindow.focus();
    printWindow.print();
  };
  frame.srcdoc = html;
  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 120_000);
}
