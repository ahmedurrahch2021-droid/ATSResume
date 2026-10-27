import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ResumeData } from '../../types';
import { getResumeDocumentBlocks, type ResumeDocumentBlock, type ResumeDocumentSettings } from '../../utils/resumeDocument';
import { paginateResumeBlocks, RESUME_PAGE_WIDTH, RESUME_PAGE_HEIGHT, RESUME_PAGE_PADDING } from '../../utils/resumePagination';

export interface ResumeLayout { pages: ResumeDocumentBlock[][]; oversized: boolean }
interface ResumePreviewProps { resume: ResumeData; settings: ResumeDocumentSettings; onLayout?: (layout: ResumeLayout) => void }

export function DocumentBlock({ block, photoShape }: { block: ResumeDocumentBlock; photoShape?: ResumeData['photoShape'] }) {
  if (block.type === 'photo') return <div className="resume-block resume-block-photo"><img src={block.text} alt="Resume photo" style={{ borderRadius: photoShape === 'circle' ? '50%' : '4px' }} /></div>;
  return (
    <div className={`resume-block resume-block-${block.type}`} data-block-id={block.id}>
      {block.type === 'bullet' && <span className="resume-bullet-marker" aria-hidden="true">•</span>}
      <span>{block.text}</span>
      {block.detail && <span className="resume-block-detail">{block.detail}</span>}
    </div>
  );
}

export function ResumePreview({ resume, settings, onLayout }: ResumePreviewProps) {
  const blocks = useMemo(() => getResumeDocumentBlocks(resume), [resume]);
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(RESUME_PAGE_WIDTH);
  const [pages, setPages] = useState<ResumeDocumentBlock[][]>([blocks]);
  const [oversized, setOversized] = useState(false);
  const [fullSize, setFullSize] = useState(false);
  const style = { fontFamily: `${settings.font}, sans-serif`, '--resume-accent': settings.accent, '--resume-padding': `${RESUME_PAGE_PADDING}px` } as React.CSSProperties;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => setWidth(container.clientWidth));
    observer.observe(container);
    setWidth(container.clientWidth);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const update = () => {
      if (measure.getBoundingClientRect().width === 0) return;
      const heights = Array.from(measure.children).map((child) => child.getBoundingClientRect().height);
      const nextPages = paginateResumeBlocks(blocks, heights);
      const contentHeight = RESUME_PAGE_HEIGHT - RESUME_PAGE_PADDING * 2;
      const tooLarge = nextPages.some((page) => page.reduce((height, block) => height + (heights[blocks.indexOf(block)] ?? 0), 0) > contentHeight);
      setPages(nextPages);
      setOversized(tooLarge);
      onLayout?.({ pages: nextPages, oversized: tooLarge });
    };
    update();
    // Re-measure when the mobile preview is revealed or an image/font lays out.
    const observer = new ResizeObserver(update);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [blocks, settings.font, settings.spacing, onLayout]);

  const scale = fullSize ? 1 : Math.min(1, (width || RESUME_PAGE_WIDTH) / RESUME_PAGE_WIDTH);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted print:hidden">
        <span>{pages.length} A4 page{pages.length === 1 ? '' : 's'} in this preview</span>
        <button type="button" className="min-h-11 rounded-btn px-3 hover:bg-surface text-ink" aria-pressed={fullSize} onClick={() => setFullSize((current) => !current)}>{fullSize ? 'Fit width' : 'View at 100%'}</button>
      </div>
      {oversized && <p className="rounded-card border border-warning/30 bg-warning-soft p-3 text-sm text-warning print:hidden">A block is too tall for one page. Shorten it or split it before exporting. Word may paginate differently from the browser.</p>}
      <div ref={containerRef} className="resume-preview-container">
        <div className={`resume-measure resume-document resume-spacing-${settings.spacing}`} style={{ ...style, width: RESUME_PAGE_WIDTH }} aria-hidden="true">
          <div ref={measureRef}>{blocks.map((block) => <DocumentBlock key={block.id} block={block} photoShape={resume.photoShape} />)}</div>
        </div>
        <div className="resume-pages">
          {pages.map((page, index) => (
            <div key={index} className="resume-page-shell" style={{ width: RESUME_PAGE_WIDTH * scale, height: RESUME_PAGE_HEIGHT * scale }}>
              <article className={`resume-document resume-spacing-${settings.spacing}`} aria-label={`Resume page ${index + 1}`} style={{ ...style, width: RESUME_PAGE_WIDTH, minHeight: RESUME_PAGE_HEIGHT, transform: `scale(${scale})` }}>
                {page.map((block) => <DocumentBlock key={block.id} block={block} photoShape={resume.photoShape} />)}
                {blocks.length === 0 && <p className="resume-empty-preview print:hidden">Your resume preview will appear here. Start with your own details or import a file.</p>}
              </article>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted leading-relaxed print:hidden">Measured with the selected browser font. DOCX can reflow in Word; check the downloaded document. A page count is not an ATS verdict.</p>
    </div>
  );
}
