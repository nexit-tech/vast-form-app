"use client";

import { useState } from "react";
import RequestModal from "../RequestModal/RequestModal";
import styles from "../../page.module.css";

interface DashboardListProps {
  requests: any[];
}

export default function DashboardList({ requests }: DashboardListProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <div className={styles.grid}>
        {requests.map((req) => (
          <div 
            key={req.id} 
            className={`${styles.card} ${styles.clickable}`}
            onClick={() => setSelectedRequest(req)}
          >
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.name}>{req.full_name}</h2>
                <span className={styles.role}>{req.role}</span>
              </div>
              <span className={styles.badge} data-type={req.action?.includes("Embarque") ? "Embark" : req.action?.includes("Desembarque") ? "Disembark" : "Default"}>
                {req.action}
              </span>
            </div>

            <div className={styles.details}>
              <div className={styles.row}>
                <span className={styles.label}>Empresa / Navio</span>
                <span className={styles.value}>
                  {req.company} {req.vessel ? `— ${req.vessel}` : ""}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Documento</span>
                <span className={styles.value}>{req.document_id}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Enviado em</span>
                <span className={styles.valueHighlight}>
                  {formatDateShort(req.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RequestModal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        data={selectedRequest} 
      />
    </>
  );
}