"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { language } = useLanguage();
  const isPt = language === "pt";

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    replace(createPageURL(page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        {isPt ? "← Anterior" : "← Previous"}
      </button>
      
      <span className={styles.info}>
        {isPt ? "Página" : "Page"} <span className={styles.current}>{currentPage}</span> {isPt ? "de" : "of"} {totalPages}
      </span>

      <button
        className={styles.button}
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        {isPt ? "Próximo →" : "Next →"}
      </button>
    </div>
  );
}