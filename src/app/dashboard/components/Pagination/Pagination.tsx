"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
        ← Anterior
      </button>
      
      <span className={styles.info}>
        Página <span className={styles.current}>{currentPage}</span> de {totalPages}
      </span>

      <button
        className={styles.button}
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Próximo →
      </button>
    </div>
  );
}