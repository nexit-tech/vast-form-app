"use client";

import { ChangeEvent } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
}

export default function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required = false,
}: InputProps) {
  return (
    <div className={`${styles.container} ${error ? styles.hasError : ""}`}>
      <label htmlFor={name} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}