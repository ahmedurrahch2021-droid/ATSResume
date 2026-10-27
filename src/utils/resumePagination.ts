import type { ResumeDocumentBlock } from './resumeDocument';

export const RESUME_PAGE_WIDTH = 794;
export const RESUME_PAGE_HEIGHT = 1123;
export const RESUME_PAGE_PADDING = 60;

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
