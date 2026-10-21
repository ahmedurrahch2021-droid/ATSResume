/**
 * Client-Side File Extraction and Ingestion Engine
 * Handles Text, Markdown, PDF streams, and checks for outdated Bio-Data elements.
 */

export interface BioDataCheckResult {
  hasBioDataClutter: boolean;
  detectedFields: {
    field: string;
    foundText: string;
    recommendation: string;
  }[];
}

/**
 * Scan resume text for outdated personal trivia that harms ATS parsing and international hiring.
 */
export function checkBioDataClutter(text: string): BioDataCheckResult {
  const detected: BioDataCheckResult['detectedFields'] = [];

  const patterns = [
    {
      regex: /(father(?:'s)?\s*name[:\-\s]+[^\n\r,]+)/i,
      field: "Father's Name",
      recommendation: "Remove entirely. International & modern ATS algorithms disregard parental info and can trigger bias filters."
    },
    {
      regex: /(mother(?:'s)?\s*name[:\-\s]+[^\n\r,]+)/i,
      field: "Mother's Name",
      recommendation: "Remove entirely. Irrelevant for technical & corporate qualifications."
    },
    {
      regex: /(blood\s*group[:\-\s]+[A-Za-z0-9\+\-]+)/i,
      field: "Blood Group",
      recommendation: "Remove entirely. Medical data belongs in medical records, not professional job applications."
    },
    {
      regex: /(religion[:\-\s]+[^\n\r,]+)/i,
      field: "Religion",
      recommendation: "Remove entirely. Religious affiliations are strictly prohibited under US/EU/UK and modern anti-bias hiring laws."
    },
    {
      regex: /(marital\s*status[:\-\s]+[^\n\r,]+)/i,
      field: "Marital Status",
      recommendation: "Remove. Marital status is considered private and irrelevant to professional competence."
    },
    {
      regex: /(permanent\s*address[:\-\s]+[^\n\r]+)/i,
      field: "Permanent Address",
      recommendation: "Consolidate into simple 'City, Country' (e.g., 'Dhaka, Bangladesh'). Exact home addresses pose privacy risks."
    },
    {
      regex: /(national\s*id|nid(?:\s*no)?[:\-\s]+[0-9\-]+)/i,
      field: "National ID / NID",
      recommendation: "Remove. Never share government identification numbers on unencrypted resumes."
    }
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      detected.push({
        field: p.field,
        foundText: match[1].trim(),
        recommendation: p.recommendation
      });
    }
  }

  return {
    hasBioDataClutter: detected.length > 0,
    detectedFields: detected
  };
}

/**
 * Clean bio-data clutter from raw text
 */
export function purgeBioDataClutter(text: string): string {
  let cleaned = text;
  const purgeRegexes = [
    /father(?:'s)?\s*name[:\-\s]+[^\n\r,]+/gi,
    /mother(?:'s)?\s*name[:\-\s]+[^\n\r,]+/gi,
    /blood\s*group[:\-\s]+[A-Za-z0-9\+\-]+/gi,
    /religion[:\-\s]+[^\n\r,]+/gi,
    /marital\s*status[:\-\s]+[^\n\r,]+/gi,
    /national\s*id|nid(?:\s*no)?[:\-\s]+[0-9\-]+/gi
  ];

  for (const r of purgeRegexes) {
    cleaned = cleaned.replace(r, '');
  }

  // Clean empty lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  return cleaned;
}

/**
 * Read uploaded file client-side and extract string text
 */
export async function extractTextFromFile(file: File): Promise<{ text: string; fileName: string; size: number }> {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const size = file.size;
    const lowerName = fileName.toLowerCase();

    // Plain text or markdown
    if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.json') || file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ text: String(reader.result || ''), fileName, size });
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
      return;
    }

    // PDF or Binary doc
    // Read as ArrayBuffer and extract readable UTF-8 text streams
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(buffer);
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const rawString = decoder.decode(uint8Array);

        // Extract printable strings from PDF streams
        if (lowerName.endsWith('.pdf')) {
          const textMatches = extractPdfReadableText(rawString);
          if (textMatches && textMatches.length > 100) {
            resolve({ text: textMatches, fileName, size });
            return;
          }
        }

        // Fallback: extract continuous ASCII/printable strings
        const cleaned = extractPrintableTokens(rawString);
        resolve({ text: cleaned, fileName, size });
      } catch (err) {
        reject(new Error('Could not parse binary document: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read binary file'));
    reader.readAsArrayBuffer(file);
  });
}

function extractPdfReadableText(raw: string): string {
  // Extract text within PDF BT ... ET blocks or string literals ( ... )
  const textBlocks: string[] = [];
  
  // Look for PDF literal strings in parentheses (Text) Tj / TJ
  const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(raw)) !== null) {
    const cleanStr = match[1]
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\r/g, ' ')
      .replace(/\\n/g, ' ')
      .trim();
    if (cleanStr.length > 1) {
      textBlocks.push(cleanStr);
    }
  }

  if (textBlocks.length > 10) {
    return textBlocks.join(' ').replace(/\s{2,}/g, ' ');
  }

  return extractPrintableTokens(raw);
}

function extractPrintableTokens(raw: string): string {
  // Extract sequences of 3 or more printable characters
  const tokens = raw.match(/[\x20-\x7E\xA0-\xFF\n\r\t]{4,}/g) || [];
  const filtered = tokens.filter(t => {
    const s = t.trim();
    // Exclude PDF bytecode and XML tags
    if (s.startsWith('obj') || s.startsWith('endobj') || s.startsWith('xref') || s.startsWith('stream')) return false;
    if (s.startsWith('<?xml') || s.includes('xmlns:')) return false;
    return s.length > 2;
  });

  return filtered.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
