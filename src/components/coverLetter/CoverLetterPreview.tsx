import React, { useLayoutEffect, useRef, useState } from 'react';
import type { CoverLetterData } from '../../types/coverLetter';
import { coverLetterStyles, getCoverLetterBlocks } from '../../utils/coverLetterDocument';

interface CoverLetterPreviewProps { data: CoverLetterData; scale?: number | 'fit' }

export function CoverLetterPreview({ data, scale = 'fit' }: CoverLetterPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(794);
  const [height, setHeight] = useState(1123);
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const sheet = sheetRef.current;
    if (!viewport || !sheet) return;
    const update = () => { if (viewport.clientWidth) setWidth(viewport.clientWidth); if (sheet.offsetHeight) setHeight(sheet.offsetHeight); };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport); observer.observe(sheet);
    return () => observer.disconnect();
  }, []);
  const factor = scale === 'fit' ? Math.min(1, width / 794) : scale;
  return (
    <div className="space-y-3 min-w-0">
      {height > 1125 && <p className="text-xs text-warning">This letter is longer than one A4 page. Review the page breaks in the print dialog.</p>}
      <div ref={viewportRef} className="document-preview-container" aria-label="Cover letter paper preview" tabIndex={0}>
        <style>{coverLetterStyles(data)}</style>
        <div className="document-page-shell" style={{ width: 794 * factor, height: height * factor }}>
          <article ref={sheetRef} id="cover-letter-preview-sheet" aria-label="Cover letter document" className={`cover-letter-document letter-${data.templateStyle}`} style={{ position: 'absolute', top: 0, left: 0, width: 794, minHeight: 1123, padding: 60, transform: `scale(${factor})`, transformOrigin: 'top left' }}>
            {getCoverLetterBlocks(data).map((block) => <div key={block.id} className={`letter-block letter-${block.type} letter-${block.id}${block.keepWithNext ? ' letter-keep' : ''}`}>{block.type === 'bullet' && <span className="letter-marker" aria-hidden="true">•</span>}{block.text}</div>)}
          </article>
        </div>
      </div>
      <p className="text-xs text-muted">A4 width · {Math.round(factor * 100)}% view. Word may reflow differently; review each exported file.</p>
    </div>
  );
}
