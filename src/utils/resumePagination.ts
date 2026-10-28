import type { ResumeDocumentBlock } from './resumeDocument';

// Physical A4 at CSS's 96 px/in, rather than rounded dimensions that can rewrap in print.
export const RESUME_PAGE_WIDTH = 210 * 96 / 25.4;
export const RESUME_PAGE_HEIGHT = 297 * 96 / 25.4;
export const RESUME_PAGE_PADDING = 60;

/** Never export stale measured text or a previously enabled photo. */
export function pagesForDocument(blocks: ResumeDocumentBlock[], measuredPages?: ResumeDocumentBlock[][]): ResumeDocumentBlock[][] {
  const fingerprint = (block: ResumeDocumentBlock): string => JSON.stringify([
    block.id, block.type, block.text, block.detail, block.keepWithNext, block.photo, block.photoShape,
    (block.children ?? []).map(fingerprint),
  ]);
  if (!measuredPages?.length || measuredPages.flat().map(fingerprint).join('\n') !== blocks.map(fingerprint).join('\n')) return [blocks];
  let offset = 0;
  return measuredPages.map((page) => {
    const current = blocks.slice(offset, offset + page.length);
    offset += page.length;
    return current;
  });
}

/** Greedy pagination of measured blocks; keep headings/role headers with the next block. */
export function paginateResumeBlocks(blocks: ResumeDocumentBlock[], heights: number[], contentHeight = RESUME_PAGE_HEIGHT - RESUME_PAGE_PADDING * 2): ResumeDocumentBlock[][] {
  if (!blocks.length) return [[]];
  const pages: ResumeDocumentBlock[][] = [];
  let page: ResumeDocumentBlock[] = [];
  let used = 0;
  for (let index = 0; index < blocks.length;) {
    const group: ResumeDocumentBlock[] = [];
    let height = 0;
    do {
      group.push(blocks[index]);
      height += Math.max(0, heights[index] ?? 0);
      index++;
    } while (index < blocks.length && blocks[index - 1].keepWithNext);
    if (page.length && used + height > contentHeight) { pages.push(page); page = []; used = 0; }
    page.push(...group);
    used += height;
  }
  if (page.length) pages.push(page);
  return pages;
}
