import type { ResumeData } from '../types';
import { DEFAULT_DOCUMENT_SETTINGS, documentPlainText, getResumeDocumentBlocks, type ResumeDocumentBlock, type ResumeDocumentSettings } from './resumeDocument';

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

export function downloadResumeText(resume: ResumeData): void {
  downloadBlob(new Blob([documentPlainText(resume)], { type: 'text/plain;charset=utf-8' }), `${resumeFilename(resume)}_resume.txt`);
}

/** Real OPC/DOCX package; no HTML file disguised as Word. All content is body-flow. */
export async function buildResumeDocx(resume: ResumeData, settings: ResumeDocumentSettings = DEFAULT_DOCUMENT_SETTINGS, measuredPages?: ResumeDocumentBlock[][]): Promise<Uint8Array<ArrayBuffer>> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const accent = /^#[0-9a-f]{6}$/i.test(settings.accent) ? settings.accent.slice(1) : '8e533c';
  const font = ['Arial', 'Calibri', 'Georgia'].includes(settings.font) ? settings.font : 'Arial';
  const blocks = getResumeDocumentBlocks(resume);
  const pages = measuredPages?.length && measuredPages.flat().map((block) => block.id).join('|') === blocks.map((block) => block.id).join('|') ? measuredPages : [blocks];
  let photoExtension = '';
  const photo = blocks.find((block) => block.type === 'photo')?.text.match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
  if (photo) {
    photoExtension = photo[1] === 'jpeg' ? 'jpg' : 'png';
    zip.file(`word/media/photo.${photoExtension}`, photo[2], { base64: true });
  }
  const run = (text: string) => `<w:r><w:t xml:space="preserve">${escapeDocumentText(text)}</w:t></w:r>`;
  const paragraph = (block: ResumeDocumentBlock) => {
    if (block.type === 'photo') {
      if (!photoExtension) return '';
      return `<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="762000" cy="762000"/><wp:docPr id="1" name="Resume photo"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="Resume photo"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdPhoto"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="762000" cy="762000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
    }
    const style = block.type === 'name' ? 'ResumeName' : block.type === 'heading' ? 'Heading1' : block.type === 'role' || block.type === 'title' ? 'ResumeRole' : block.type === 'contact' ? 'ResumeContact' : 'Normal';
    const list = block.type === 'bullet' ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : '';
    const text = `${block.text}${block.detail ? ` | ${block.detail}` : ''}`;
    return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${block.keepWithNext ? '<w:keepNext/>' : ''}${list}</w:pPr>${text.split('\n').map((line, index) => `${index ? '<w:r><w:br/></w:r>' : ''}${run(line)}`).join('')}</w:p>`;
  };
  const xmlStart = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const body = pages.map((page, index) => `${index ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : ''}${page.map(paragraph).join('')}`).join('');
  zip.file('word/document.xml', `${xmlStart}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="907" w:right="907" w:bottom="907" w:left="907" w:header="0" w:footer="0"/></w:sectPr></w:body></w:document>`);
  zip.file('word/styles.xml', `${xmlStart}<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}" w:cs="${font}"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="20211f"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="${settings.spacing === 'compact' ? '288' : '336'}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="ResumeName"><w:name w:val="Resume Name"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="${accent}"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="ResumeRole"><w:name w:val="Resume Role"/><w:basedOn w:val="Normal"/><w:rPr><w:b/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="ResumeContact"><w:name w:val="Contact"/><w:basedOn w:val="Normal"/><w:rPr><w:sz w:val="20"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="180" w:after="80"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="${accent}"/></w:rPr></w:style></w:styles>`);
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
  const blocks = getResumeDocumentBlocks(resume);
  const pages = measuredPages?.length && measuredPages.flat().map((block) => block.id).join('|') === blocks.map((block) => block.id).join('|') ? measuredPages : [blocks];
  const accent = /^#[0-9a-f]{6}$/i.test(settings.accent) ? settings.accent : '#8e533c';
  const font = ['Arial', 'Calibri', 'Georgia'].includes(settings.font) ? settings.font : 'Arial';
  const render = (block: ResumeDocumentBlock) => block.type === 'photo' ? `<div class="block photo"><img alt="Resume photo" src="${escapeDocumentText(block.text)}"></div>` : `<div class="block ${block.type}">${block.type === 'bullet' ? '<span class="marker">•</span>' : ''}${escapeDocumentText(block.text).replace(/\n/g, '<br>')}${block.detail ? `<span class="detail">${escapeDocumentText(block.detail)}</span>` : ''}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeDocumentText(resume.fullName || 'Resume')}</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;color:#20211f;background:white;font-family:${font},sans-serif;font-size:11pt;line-height:${settings.spacing === 'compact' ? '1.25' : '1.4'}}.page{width:210mm;min-height:297mm;padding:15.875mm;break-after:page}.page:last-child{break-after:auto}.block{padding:0 0 4px;white-space:pre-wrap;overflow-wrap:anywhere;break-inside:avoid}.name{font-size:20pt;font-weight:bold;line-height:1.15;color:${accent};padding-bottom:6px;break-after:avoid}.title{font-weight:bold;padding-bottom:4px;break-after:avoid}.contact{font-size:10pt;line-height:1.4;padding-bottom:3px}.heading{font-size:12pt;font-weight:bold;color:${accent};padding-top:12px;padding-bottom:6px;break-after:avoid}.role{font-weight:bold;padding-top:8px;padding-bottom:4px;break-after:avoid}.detail{display:block;font-weight:normal;font-size:10pt;line-height:1.4}.bullet{padding-left:16px;position:relative}.marker{position:absolute;left:2px}.photo{padding:8px 0}.photo img{width:80px;height:80px;object-fit:cover}.compact .block{padding-bottom:2px}</style></head><body>${pages.map((page) => `<article class="page">${page.map(render).join('')}</article>`).join('')}</body></html>`;
}

/** The browser supplies the PDF text layer. No popup or external rendering service. */
export function printResume(resume: ResumeData, settings: ResumeDocumentSettings, pages?: ResumeDocumentBlock[][]): void {
  const frame = document.createElement('iframe');
  frame.title = 'Resume PDF print document';
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
  frame.srcdoc = buildResumePrintHtml(resume, settings, pages);
  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 120_000);
}
