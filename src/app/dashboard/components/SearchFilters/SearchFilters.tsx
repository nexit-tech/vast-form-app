"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import styles from "./SearchFilters.module.css";

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  let timeoutId: NodeJS.Timeout;

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.icon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className={styles.input}
          placeholder="Buscar por nome, documento ou empresa..."
          onChange={handleChange}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}