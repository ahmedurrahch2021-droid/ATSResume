import { CoverLetterData } from '../types/coverLetter';

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Triggers clean vector PDF export via the browser's native print engine.
 * Renders an isolated clean document with strict print CSS and typography.
 */
export function exportCoverLetterToVectorPdf(data: CoverLetterData): void {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1100');
  if (!printWindow) {
    alert('Please allow popups for this site to generate your vector PDF.');
    return;
  }

  const accent = data.accentColor || '#C82333';
  const fontFamilyCss = data.fontFamily === 'serif' 
    ? "'Georgia', 'Times New Roman', serif" 
    : data.fontFamily === 'mono'
    ? "'JetBrains Mono', 'Courier New', monospace"
    : "'Inter', system-ui, -apple-system, sans-serif";

  const fontSizeCss = data.fontSize === 'compact' ? '13px' : data.fontSize === 'spacious' ? '15px' : '14px';
  const lineHeightCss = data.fontSize === 'compact' ? '1.5' : data.fontSize === 'spacious' ? '1.7' : '1.6';

  const bodyParagraphsHtml = data.bodyParagraphs
    .filter(p => p.trim().length > 0)
    .map(p => `<p class="paragraph">${escapeHtml(p)}</p>`)
    .join('');

  const highlightsHtml = data.keyHighlights && data.keyHighlights.length > 0
    ? `<ul class="highlights-list">
        ${data.keyHighlights.filter(h => h.trim().length > 0).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
       </ul>`
    : '';

  const linksHtml = [
    data.sender.portfolioUrl ? `<a href="https://${escapeHtml(data.sender.portfolioUrl.replace(/^https?:\/\//, ''))}">${escapeHtml(data.sender.portfolioUrl)}</a>` : '',
    data.sender.linkedInUrl ? `<a href="https://${escapeHtml(data.sender.linkedInUrl.replace(/^https?:\/\//, ''))}">${escapeHtml(data.sender.linkedInUrl)}</a>` : '',
  ].filter(Boolean).join(' &bull; ');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(data.sender.fullName)} - Cover Letter - ${escapeHtml(data.recipient.companyName)}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 18mm 20mm;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: ${fontFamilyCss};
      font-size: ${fontSizeCss};
      line-height: ${lineHeightCss};
      color: #1e293b;
      background: #ffffff;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid ${accent};
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .sender-name {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .sender-title {
      font-size: 14px;
      font-weight: 600;
      color: ${accent};
      margin-top: 2px;
    }
    .sender-contact {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .sender-contact a {
      color: #64748b;
      text-decoration: none;
    }
    .recipient-section {
      margin-top: 18px;
      margin-bottom: 20px;
      font-size: 13px;
      color: #334155;
      line-height: 1.45;
    }
    .letter-date {
      font-weight: 500;
      color: #64748b;
      margin-bottom: 12px;
    }
    .salutation {
      font-weight: 600;
      color: #0f172a;
      margin-top: 20px;
      margin-bottom: 14px;
    }
    .paragraph {
      margin-bottom: 14px;
      text-align: justify;
    }
    .highlights-list {
      margin: 12px 0 16px 20px;
      color: #1e293b;
    }
    .highlights-list li {
      margin-bottom: 6px;
      padding-left: 4px;
    }
    .sign-off-section {
      margin-top: 24px;
      page-break-inside: avoid;
    }
    .sign-off {
      color: #334155;
      margin-bottom: 28px;
    }
    .signature-name {
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="sender-name">${escapeHtml(data.sender.fullName)}</div>
    <div class="sender-title">${escapeHtml(data.sender.jobTitle)}</div>
    <div class="sender-contact">
      <span>${escapeHtml(data.sender.email)}</span>
      <span>&bull;</span>
      <span>${escapeHtml(data.sender.phone)}</span>
      <span>&bull;</span>
      <span>${escapeHtml(data.sender.location)}</span>
      ${linksHtml ? `<span>&bull;</span><span>${linksHtml}</span>` : ''}
    </div>
  </div>

  <div class="recipient-section">
    <div class="letter-date">${escapeHtml(data.date)}</div>
    <div><strong>${escapeHtml(data.recipient.hiringManagerName)}</strong></div>
    ${data.recipient.department ? `<div>${escapeHtml(data.recipient.department)}</div>` : ''}
    <div><strong>${escapeHtml(data.recipient.companyName)}</strong></div>
    ${data.recipient.companyAddress ? `<div>${escapeHtml(data.recipient.companyAddress)}</div>` : ''}
  </div>

  <div class="salutation">${escapeHtml(data.salutation)}</div>

  <p class="paragraph">${escapeHtml(data.opening)}</p>

  ${bodyParagraphsHtml}

  ${highlightsHtml}

  <p class="paragraph">${escapeHtml(data.closing)}</p>

  <div class="sign-off-section">
    <div class="sign-off">${escapeHtml(data.signOff)}</div>
    <div class="signature-name">${escapeHtml(data.sender.fullName)}</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Exports cover letter as an editable Word-compatible document (.doc HTML package).
 */
export function exportCoverLetterToWord(data: CoverLetterData): void {
  const accent = data.accentColor || '#C82333';
  const bodyParagraphs = data.bodyParagraphs
    .filter(p => p.trim().length > 0)
    .map(p => `<p style="margin: 0 0 12pt 0; font-size: 11pt; line-height: 1.5; color: #1e293b;">${escapeHtml(p)}</p>`)
    .join('');

  const highlights = data.keyHighlights && data.keyHighlights.length > 0
    ? `<ul style="margin: 8pt 0 12pt 24pt; font-size: 11pt; line-height: 1.5; color: #1e293b;">
        ${data.keyHighlights.filter(h => h.trim().length > 0).map(h => `<li style="margin-bottom: 4pt;">${escapeHtml(h)}</li>`).join('')}
       </ul>`
    : '';

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(data.sender.fullName)} - Cover Letter</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 1in; }
        h1 { font-size: 18pt; margin: 0 0 4pt 0; color: #0f172a; }
        .title { font-size: 12pt; font-weight: bold; color: ${accent}; margin-bottom: 6pt; }
        .contact { font-size: 10pt; color: #64748b; margin-bottom: 18pt; }
        .rule { border-bottom: 1.5pt solid ${accent}; margin-bottom: 18pt; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(data.sender.fullName)}</h1>
      <div class="title">${escapeHtml(data.sender.jobTitle)}</div>
      <div class="contact">
        ${escapeHtml(data.sender.email)} | ${escapeHtml(data.sender.phone)} | ${escapeHtml(data.sender.location)}
      </div>
      <div class="rule"></div>

      <p style="margin-bottom: 12pt; color: #64748b;">${escapeHtml(data.date)}</p>
      <p style="margin-bottom: 16pt;">
        <strong>${escapeHtml(data.recipient.hiringManagerName)}</strong><br>
        ${data.recipient.department ? `${escapeHtml(data.recipient.department)}<br>` : ''}
        <strong>${escapeHtml(data.recipient.companyName)}</strong><br>
        ${data.recipient.companyAddress ? `${escapeHtml(data.recipient.companyAddress)}<br>` : ''}
      </p>

      <p style="font-weight: bold; margin-bottom: 12pt;">${escapeHtml(data.salutation)}</p>

      <p style="margin-bottom: 12pt; font-size: 11pt; line-height: 1.5;">${escapeHtml(data.opening)}</p>

      ${bodyParagraphs}

      ${highlights}

      <p style="margin-bottom: 16pt; font-size: 11pt; line-height: 1.5;">${escapeHtml(data.closing)}</p>

      <p style="margin-bottom: 24pt;">${escapeHtml(data.signOff)}</p>
      <p><strong>${escapeHtml(data.sender.fullName)}</strong></p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  const safeFilename = `${data.sender.fullName.replace(/\s+/g, '_')}_Cover_Letter_${data.recipient.companyName.replace(/\s+/g, '_')}.doc`;
  downloadLink.download = safeFilename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Returns clean plain text representation for copying directly into applicant tracking portals.
 */
export function formatCoverLetterPlainText(data: CoverLetterData): string {
  const parts = [
    data.sender.fullName.toUpperCase(),
    data.sender.jobTitle,
    `${data.sender.email} | ${data.sender.phone} | ${data.sender.location}`,
    data.sender.portfolioUrl ? `Portfolio: ${data.sender.portfolioUrl}` : '',
    data.sender.linkedInUrl ? `LinkedIn: ${data.sender.linkedInUrl}` : '',
    '--------------------------------------------------',
    data.date,
    '',
    data.recipient.hiringManagerName,
    data.recipient.department || '',
    data.recipient.companyName,
    data.recipient.companyAddress || '',
    '',
    data.salutation,
    '',
    data.opening,
    '',
    ...data.bodyParagraphs.filter(p => p.trim().length > 0),
    '',
    ...(data.keyHighlights && data.keyHighlights.length > 0
      ? ['Key Highlights & Achievements:', ...data.keyHighlights.map(h => `• ${h}`), '']
      : []),
    data.closing,
    '',
    data.signOff,
    data.sender.fullName,
  ].filter(line => line !== null && line !== undefined);

  return parts.join('\n');
}
