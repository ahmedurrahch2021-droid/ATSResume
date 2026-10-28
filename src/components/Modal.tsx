import React, { useEffect, useRef } from 'react';
import { trapDialogFocus } from '../utils/dialogFocus';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
}

/** Native modal semantics: top layer, inert background, Escape and focus return. */
export function Modal({ isOpen, onClose, labelledBy, children, className = '' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!isOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, [isOpen]);

  return (
    <dialog ref={ref} aria-labelledby={labelledBy} className={`site-modal ${className}`} onKeyDown={trapDialogFocus} onCancel={onClose} onClose={() => { if (!ref.current?.open) onClose(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
      {isOpen && children}
    </dialog>
  );
}
