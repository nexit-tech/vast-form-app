"use client";

import { useEffect } from "react";
import styles from "./RequestModal.module.css";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function RequestModal({ isOpen, onClose, data }: RequestModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h2>{data.full_name}</h2>
            <span className={styles.statusBadge}>{data.action}</span>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>Empresa</span>
                <span className={styles.value}>{data.company}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Cargo</span>
                <span className={styles.value}>{data.role}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>CPF / Passaporte</span>
                <span className={styles.value}>{data.document_id}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>RG</span>
                <span className={styles.value}>{data.rg}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Data de Nascimento</span>
                <span className={styles.value}>{formatBirthDate(data.birth_date)}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Dados da Solicitação</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>Embarcação</span>
                <span className={styles.value}>{data.vessel || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Data do Envio</span>
                <span className={styles.value}>{formatDate(data.created_at)}</span>
              </div>
            </div>
          </section>

          {data.has_vehicle === "Sim" && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Dados do Veículo</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.label}>Veículo</span>
                  <span className={styles.value}>{data.vehicle_model}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Placa</span>
                  <span className={styles.value}>{data.vehicle_plate}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>CNH</span>
                  <span className={styles.value}>{data.cnh_number}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Validade CNH</span>
                  <span className={styles.value}>{formatBirthDate(data.cnh_validity)}</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}