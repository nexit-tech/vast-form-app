"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./RequestModal.module.css";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function RequestModal({ isOpen, onClose, data }: RequestModalProps) {
  const { language } = useLanguage();
  const isPt = language === "pt";

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
    return new Date(dateString).toLocaleDateString(isPt ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return "-";
    if (dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Mobile Drag Handle */}
        <div className={styles.dragHandle}>
          <div className={styles.dragHandleBar} />
        </div>

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
            <h3 className={styles.sectionTitle}>
              {isPt ? "Dados Pessoais" : "Personal Data"}
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Empresa" : "Company"}</span>
                <span className={styles.value}>{data.company}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Cargo" : "Role"}</span>
                <span className={styles.value}>{data.role}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Documento" : "Document ID"}</span>
                <span className={styles.value}>{data.document_id}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>RG</span>
                <span className={styles.value}>{data.rg}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Nascimento" : "Birth Date"}</span>
                <span className={styles.value}>{formatBirthDate(data.birth_date)}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {isPt ? "Solicitação" : "Request Data"}
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Embarcação" : "Vessel"}</span>
                <span className={styles.value}>{data.vessel || "N/A"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Enviado em" : "Submitted on"}</span>
                <span className={styles.value}>{formatDate(data.created_at)}</span>
              </div>
            </div>
          </section>

          {data.has_vehicle && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                {isPt ? "Veículo" : "Vehicle Data"}
              </h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Modelo" : "Model"}</span>
                  <span className={styles.value}>{data.vehicle_model}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Placa" : "Plate"}</span>
                  <span className={styles.value}>{data.vehicle_plate}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>CNH</span>
                  <span className={styles.value}>{data.cnh_number}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Validade" : "Validity"}</span>
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