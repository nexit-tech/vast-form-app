import { TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <textarea
        className={`${styles.textarea} ${error ? styles.errorTextarea : ""} ${className || ""}`}
        id={props.id || props.name}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}