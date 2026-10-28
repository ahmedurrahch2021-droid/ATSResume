import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { RESEARCH_HIGHLIGHTS } from '../../data/researchHighlights';
import { sourcesFor } from '../../data/resumeSources';
import { ROUTE_PATHS } from '../../routes';

export function ResearchCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ first: 1, last: 1, previous: false, next: true });

  const updatePosition = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.floor((track.clientWidth - 8 + gap) / step + 0.01));
    const first = Math.min(RESEARCH_HIGHLIGHTS.length - visible, Math.round(track.scrollLeft / step)) + 1;
    const next = track.scrollWidth - track.clientWidth - track.scrollLeft > 2;
    setPosition({ first, last: Math.min(RESEARCH_HIGHLIGHTS.length, first + visible - 1), previous: track.scrollLeft > 2, next });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    const visible = position.last - position.first + 1;
    track.scrollTo({
      left: (Math.round(track.scrollLeft / step) + direction * visible) * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <section id="research" className="border-b border-line bg-surface py-12 sm:py-16" aria-labelledby="research-title">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="eyebrow">The research behind ATS Resume Lab</p>
          <h2 id="research-title" className="mt-3 text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">Credible sources. Practical help for your next application.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">We turn published career guidance, ATS documentation and writing research into tools you can use: readable layouts, text you can inspect and edits grounded in your own facts. Free for job seekers in Bangladesh and beyond.</p>
        </div>

        <div className="mt-7" role="region" aria-roledescription="carousel" aria-label="Research sources">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Select a logo to read its source. Swipe or use the arrows.</p>
            <div className="flex items-center gap-2">
              <p className="mr-2 text-xs tabular-nums text-muted" aria-live="polite" aria-atomic="true">{position.first === position.last ? position.first : `${position.first}–${position.last}`} of {RESEARCH_HIGHLIGHTS.length} sources</p>
              <button type="button" className="btn btn-secondary w-11 px-0" aria-label="Previous research sources" aria-controls="research-source-list" disabled={!position.previous} onClick={() => move(-1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" className="btn btn-secondary w-11 px-0" aria-label="Next research sources" aria-controls="research-source-list" disabled={!position.next} onClick={() => move(1)}><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
          <ul id="research-source-list" ref={trackRef} className="research-track" onScroll={updatePosition} aria-label="Published research and guidance">
            {RESEARCH_HIGHLIGHTS.map((highlight) => {
              const source = sourcesFor([highlight.sourceId])[0];
              return <li key={highlight.sourceId} className="min-w-0">
                <a href={source.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="research-card group">
                  <div className={`research-logo ${highlight.darkLogoBackground ? 'bg-ink' : 'bg-surface'}`}>
                    {highlight.logos.map((logo) => <img key={logo.src} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" decoding="async" className={highlight.logos.length > 1 ? 'research-logo-stacked' : ''} />)}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm font-semibold text-ink">{highlight.name}</p>
                    <p className="mt-1 text-xs text-muted">{highlight.category}</p>
                    <h3 className="mt-4 text-[17px] font-semibold leading-snug">{highlight.benefit}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{highlight.application}</p>
                    <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 group-hover:decoration-accent">Open the source <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">: {source.title} (opens in a new tab)</span></span>
                  </div>
                </a>
              </li>;
            })}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
          <p className="max-w-2xl text-xs leading-relaxed text-muted"><strong className="font-semibold text-ink">References, not endorsements.</strong> Logos identify the publishers of documents we used. These institutions have not certified this tool; research findings are not a promise of an interview or a job.</p>
          <Link to={`${ROUTE_PATHS['country-guides']}#source-library`} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline underline-offset-4">Browse the source library <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
