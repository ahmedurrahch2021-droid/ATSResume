import type React from 'react';

/** Keep Tab within the visible controls instead of handing it to browser chrome. */
export function trapDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>): void {
  if (event.key !== 'Tab') return;
  const dialog = event.currentTarget;
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'))
    .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
  const first = controls[0];
  const last = controls.at(-1);
  if (!first || !last) { event.preventDefault(); dialog.focus(); return; }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog)) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (active === last || active === dialog)) { event.preventDefault(); first.focus(); }
}
