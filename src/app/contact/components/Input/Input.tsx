import { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={styles.container}>
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <input
        className={`${styles.input} ${error ? styles.errorInput : ""} ${className || ""}`}
        id={props.id || props.name}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}