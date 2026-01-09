"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDisplayDate } from "@/utils/date";
import { Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import RequestModal from "../RequestModal/RequestModal";
import styles from "./DashboardList.module.css";

interface Request {
  id: string;
  created_at: string;
  full_name: string;
  company: string;
  role: string;
  status: string;
  vessel: string;
  document_id: string;
  rg: string;
  birth_date: string;
  action: string;
  has_vehicle: boolean;
  vehicle_model?: string;
  vehicle_plate?: string;
  cnh_number?: string;
  cnh_validity?: string;
}

interface DashboardListProps {
  requests: Request[];
}

export default function DashboardList({ requests }: DashboardListProps) {
  const { language } = useLanguage();
  const isPt = language === "pt";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const sortField = searchParams.get("sort") || "created_at";
  const sortOrder = searchParams.get("order") || "desc";

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortField === field) {
      params.set("order", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "asc");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortOrder === "asc" 
      ? <ChevronUp size={14} style={{ opacity: 1 }} /> 
      : <ChevronDown size={14} style={{ opacity: 1 }} />;
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isPt ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
             {isPt ? "Aprovado" : "Approved"}
          </span>
        );
      case "rejected":
        return (
          <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
            {isPt ? "Rejeitado" : "Rejected"}
          </span>
        );
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
            {isPt ? "Pendente" : "Pending"}
          </span>
        );
    }
  };

  if (requests.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          {isPt ? "Nenhum registro encontrado." : "No records found."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th 
                  className={`${styles.th} ${styles.sortable}`} 
                  onClick={() => handleSort("status")}
                >
                  <div className={styles.thContent}>
                    {isPt ? "Status" : "Status"} <SortIcon field="status" />
                  </div>
                </th>
                <th 
                  className={`${styles.th} ${styles.sortable}`} 
                  onClick={() => handleSort("full_name")}
                >
                  <div className={styles.thContent}>
                    {isPt ? "Nome" : "Name"} <SortIcon field="full_name" />
                  </div>
                </th>
                <th 
                  className={`${styles.th} ${styles.sortable}`} 
                  onClick={() => handleSort("company")}
                >
                  <div className={styles.thContent}>
                    {isPt ? "Empresa" : "Company"} <SortIcon field="company" />
                  </div>
                </th>
                <th 
                  className={`${styles.th} ${styles.sortable}`} 
                  onClick={() => handleSort("role")}
                >
                  <div className={styles.thContent}>
                    {isPt ? "Função" : "Role"} <SortIcon field="role" />
                  </div>
                </th>
                <th 
                  className={`${styles.th} ${styles.sortable}`} 
                  onClick={() => handleSort("created_at")}
                >
                  <div className={styles.thContent}>
                    {isPt ? "Data" : "Date"} <SortIcon field="created_at" />
                  </div>
                </th>
                <th className={styles.th} style={{ textAlign: "right" }}></th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {requests.map((req) => (
                <tr key={req.id} onClick={() => setSelectedRequest(req)}>
                  <td className={styles.td}>
                    {getStatusBadge(req.status)}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.primaryText}>{req.full_name}</div>
                    <div className={styles.secondaryText}>ID: {req.document_id}</div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.primaryText}>{req.company}</div>
                    <div className={styles.secondaryText}>{req.vessel}</div>
                  </td>
                  <td className={styles.td}>{req.role}</td>
                  <td className={styles.td}>
                    <span className={styles.dateText}>
                      {formatShortDate(req.created_at)}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: "right" }}>
                    <button 
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      title={isPt ? "Ver detalhes" : "View details"}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RequestModal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        data={selectedRequest}
      />
    </>
  );
}