"use client";

import { useState, useOptimistic, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Check, 
  X, 
  Trash2, 
  Loader2 
} from "lucide-react";
import { updateRequestStatus, deleteRequest } from "../../actions";
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
  has_vehicle: string | boolean;
  vehicle_model?: string;
  vehicle_plate?: string;
  cnh_number?: string;
  cnh_validity?: string;
  approved_at?: string;
}

interface DashboardListProps {
  requests: Request[];
  userRole?: string;
}

export default function DashboardList({ requests, userRole = "admin" }: DashboardListProps) {
  const { language } = useLanguage();
  const isPt = language === "pt";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [optimisticRequests, addOptimisticRequest] = useOptimistic(
    requests,
    (state, updatedRequest: { id: string; type: 'update' | 'delete'; status?: string; approved_at?: string }) => {
      if (updatedRequest.type === 'delete') {
        return state.filter(req => req.id !== updatedRequest.id);
      }
      return state.map(req => 
        req.id === updatedRequest.id 
          ? { 
              ...req, 
              status: updatedRequest.status!,
              approved_at: updatedRequest.approved_at !== undefined ? updatedRequest.approved_at : req.approved_at
            } 
          : req
      );
    }
  );

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

  const handleStatusUpdate = async (e: React.MouseEvent, id: string, status: "approved" | "rejected") => {
    e.stopPropagation();
    if (processingId) return;
    
    startTransition(async () => {
      const approved_at = status === "approved" ? new Date().toISOString() : undefined;
      addOptimisticRequest({ id, type: 'update', status, approved_at });
      setProcessingId(id);
      try {
        await updateRequestStatus(id, status);
      } catch (error) {
        console.error("Failed to update status");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (processingId) return;

    if (!confirm(isPt ? "Tem certeza que deseja excluir?" : "Are you sure?")) return;

    startTransition(async () => {
      addOptimisticRequest({ id, type: 'delete' });
      setProcessingId(id);
      try {
        await deleteRequest(id);
      } catch (error) {
        console.error("Failed to delete");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown size={14} className={styles.sortIconInactive} />;
    return sortOrder === "asc" 
      ? <ChevronUp size={14} className={styles.sortIconActive} /> 
      : <ChevronDown size={14} className={styles.sortIconActive} />;
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(isPt ? "pt-BR" : "en-US", {
      day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit"
    });
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return "-";
    if (dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return new Date(dateString).toLocaleDateString(isPt ? "pt-BR" : "en-US");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className={`${styles.statusBadge} ${styles.statusApproved}`}>{isPt ? "Aprovado" : "Approved"}</span>;
      case "rejected":
        return <span className={`${styles.statusBadge} ${styles.statusRejected}`}>{isPt ? "Rejeitado" : "Rejected"}</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.statusPending}`}>{isPt ? "Pendente" : "Pending"}</span>;
    }
  };

  const getExpirationInfo = (approvedAt?: string) => {
    if (!approvedAt) return null;
    
    const approvalDate = new Date(approvedAt);
    const expirationDate = new Date(approvalDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = expirationDate.toLocaleDateString(isPt ? "pt-BR" : "en-US", {
      day: "2-digit", month: "2-digit", year: "2-digit"
    });

    if (diffDays < 0) {
      return { text: isPt ? "Expirado" : "Expired", colorClass: styles.expiresCritical, date: formattedDate };
    }
    if (diffDays === 0) {
      return { text: isPt ? "Expira hoje" : "Expires today", colorClass: styles.expiresCritical, date: formattedDate };
    }
    
    const colorClass = diffDays <= 2 ? styles.expiresCritical : (diffDays <= 4 ? styles.expiresWarning : "");
    const text = isPt ? `Expira em ${diffDays} dia(s)` : `Expires in ${diffDays} day(s)`;
    
    return { text, colorClass, date: formattedDate };
  };

  if (optimisticRequests.length === 0) {
    return (
      <div className={styles.emptyContainer}>
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
                <th onClick={() => handleSort("status")} className={styles.thSortable}>
                  <div className={styles.thContent}>Status <SortIcon field="status" /></div>
                </th>
                <th onClick={() => handleSort("full_name")} className={styles.thSortable}>
                  <div className={styles.thContent}>{isPt ? "Nome / Doc" : "Name / ID"} <SortIcon field="full_name" /></div>
                </th>
                <th className={styles.th}>{isPt ? "RG / Nasc." : "RG / Birth"}</th>
                <th onClick={() => handleSort("company")} className={styles.thSortable}>
                  <div className={styles.thContent}>{isPt ? "Empresa" : "Company"} <SortIcon field="company" /></div>
                </th>
                <th className={styles.th}>{isPt ? "Função" : "Role"}</th>
                <th className={styles.th}>{isPt ? "Veículo" : "Vehicle"}</th>
                <th onClick={() => handleSort("created_at")} className={styles.thSortable}>
                  <div className={styles.thContent}>{isPt ? "Data" : "Date"} <SortIcon field="created_at" /></div>
                </th>
                <th className={styles.thActions}>{isPt ? "Ações" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {optimisticRequests.map((req) => {
                const hasVehicle = req.has_vehicle === "Sim" || req.has_vehicle === true;
                const isProcessing = processingId === req.id;
                const expirationInfo = req.status === "approved" ? getExpirationInfo(req.approved_at) : null;
                
                return (
                  <tr key={req.id} onClick={() => setSelectedRequest(req)} className={styles.tr}>
                    <td className={styles.td}>
                      {getStatusBadge(req.status)}
                      {expirationInfo && (
                        <div className={styles.expiresContainer}>
                          <span className={`${styles.expiresText} ${expirationInfo.colorClass}`}>
                            {expirationInfo.text}
                          </span>
                          <span className={`${styles.expiresText} ${expirationInfo.colorClass}`}>
                            ({expirationInfo.date})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.primaryText}>{req.full_name}</div>
                      <div className={styles.secondaryText}>{req.document_id}</div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.primaryText}>{req.rg || "-"}</div>
                      <div className={styles.secondaryText}>{formatBirthDate(req.birth_date)}</div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.primaryText}>{req.company}</div>
                      <div className={styles.secondaryText}>{req.vessel}</div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.primaryText}>{req.role}</div>
                      <div className={styles.secondaryText} title={req.action}>
                        {req.action?.length > 20 ? `${req.action.substring(0, 20)}...` : req.action}
                      </div>
                    </td>
                    <td className={styles.td}>
                      {hasVehicle ? (
                        <>
                          <div className={styles.primaryText}>{req.vehicle_plate}</div>
                          <div className={styles.secondaryText}>{req.vehicle_model}</div>
                        </>
                      ) : <span className={styles.secondaryText}>-</span>}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{formatShortDate(req.created_at)}</span>
                    </td>
                    <td className={styles.tdActions}>
                      <div className={styles.actionsGroup}>
                        {isProcessing ? (
                          <Loader2 className={styles.spinner} size={20} />
                        ) : (
                          <>
                            {userRole !== "viewer" && (
                              <>
                                <button 
                                  className={`${styles.actionBtn} ${styles.btnApprove}`}
                                  onClick={(e) => handleStatusUpdate(e, req.id, "approved")}
                                  title={isPt ? "Aprovar" : "Approve"}
                                  disabled={req.status === 'approved'}
                                >
                                  <Check size={18} strokeWidth={2.5} />
                                </button>
                                <button 
                                  className={`${styles.actionBtn} ${styles.btnReject}`}
                                  onClick={(e) => handleStatusUpdate(e, req.id, "rejected")}
                                  title={isPt ? "Rejeitar" : "Reject"}
                                  disabled={req.status === 'rejected'}
                                >
                                  <X size={18} strokeWidth={2.5} />
                                </button>
                                <div className={styles.divider} />
                                <button 
                                  className={`${styles.actionBtn} ${styles.btnDelete}`}
                                  onClick={(e) => handleDelete(e, req.id)}
                                  title={isPt ? "Excluir" : "Delete"}
                                >
                                  <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                              </>
                            )}
                            <button 
                              className={`${styles.actionBtn} ${styles.btnView}`}
                              onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                              title={isPt ? "Detalhes" : "Details"}
                            >
                              <Eye size={18} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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