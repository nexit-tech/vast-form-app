import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function Button({ children, isLoading, ...props }: ButtonProps) {
  return (
    <button className={styles.button} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? "Enviando..." : children}
    </button>
  );
}