"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./SearchFilters.module.css";

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { language } = useLanguage();
  const isPt = language === "pt";

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

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <Search className={styles.icon} size={18} />
        <input
          className={styles.input}
          placeholder={isPt ? "Buscar por nome, documento ou empresa..." : "Search by name, ID or company..."}
          onChange={(e) => handleSearch(e.target.value)} 
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>

      <div className={styles.filterWrapper}>
        <select 
          className={styles.select}
          onChange={(e) => handleStatusFilter(e.target.value)}
          defaultValue={searchParams.get("status")?.toString() || "all"}
        >
          <option value="all">{isPt ? "Todos os Status" : "All Status"}</option>
          <option value="pending">{isPt ? "Pendente" : "Pending"}</option>
          <option value="approved">{isPt ? "Aprovado" : "Approved"}</option>
          <option value="rejected">{isPt ? "Rejeitado" : "Rejected"}</option>
        </select>
        <Filter className={styles.selectIcon} size={16} />
      </div>
    </div>
  );
}