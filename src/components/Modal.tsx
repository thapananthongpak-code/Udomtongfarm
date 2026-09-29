import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Thin wrapper around the native <dialog>, which provides focus trapping,
 * Escape handling and an inert background for free.
 */
export default function Modal({ open, onClose, labelledBy, label, className = "", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      onClose={onClose}
      onClick={(event) => {
        // The dialog fills the viewport, so a click that lands on it directly hit the backdrop area.
        if (event.target === ref.current) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}
