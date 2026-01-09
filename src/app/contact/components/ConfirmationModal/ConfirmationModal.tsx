"use client";

import { createPortal } from "react-dom";
import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.message}>{message}</div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.cancelBtn}`} 
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmBtn}`} 
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}