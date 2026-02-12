"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Calendar, User, Briefcase, Truck, FileText, Anchor } from "lucide-react";
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isPt ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateOnly = (dateString: string) => {
    if (!dateString) return "-";
    if (dateString.includes('T')) {
       return new Date(dateString).toLocaleDateString(isPt ? "pt-BR" : "en-US");
    }
    if (dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const hasVehicle = data.has_vehicle === "Sim" || data.has_vehicle === true;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.idLabel}>ID: {data.id}</span>
            <h2 className={styles.title}>{data.full_name}</h2>
            <div className={styles.statusContainer}>
              <span className={`${styles.statusBadge} ${styles[data.status || 'pending']}`}>
                {data.status || (isPt ? "Pendente" : "Pending")}
              </span>
              <span className={styles.dateBadge}>
                <Calendar size={12} />
                {formatDateTime(data.created_at)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </header>

        <div className={styles.content}>
          
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Briefcase size={16} />
              {isPt ? "Dados Corporativos" : "Corporate Data"}
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Empresa" : "Company"}</span>
                <span className={styles.value}>{data.company}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Embarcação" : "Vessel"}</span>
                <span className={styles.value}>{data.vessel}</span>
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <span className={styles.label}>{isPt ? "Função / Cargo" : "Role"}</span>
                <span className={styles.value}>{data.role}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <User size={16} />
              {isPt ? "Identificação Pessoal" : "Personal Identification"}
            </h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "CPF / Documento" : "Document ID"}</span>
                <span className={styles.value}>{data.document_id}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>RG</span>
                <span className={styles.value}>{data.rg || "-"}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>{isPt ? "Data de Nascimento" : "Birth Date"}</span>
                <span className={styles.value}>{formatDateOnly(data.birth_date)}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Anchor size={16} />
              {isPt ? "Serviço Solicitado" : "Requested Service"}
            </h3>
            <div className={styles.actionBox}>
              <span className={styles.actionLabel}>{isPt ? "Ação Requisitada" : "Action Requested"}</span>
              <p className={styles.actionValue}>{data.action}</p>
            </div>
          </section>

          {hasVehicle && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Truck size={16} />
                {isPt ? "Dados de Acesso (Veículo)" : "Access Data (Vehicle)"}
              </h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Modelo do Veículo" : "Vehicle Model"}</span>
                  <span className={styles.value}>{data.vehicle_model}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Placa" : "Plate"}</span>
                  <span className={styles.valueHighlight}>{data.vehicle_plate}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>CNH</span>
                  <span className={styles.value}>{data.cnh_number}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{isPt ? "Validade CNH" : "CNH Validity"}</span>
                  <span className={styles.value}>{formatDateOnly(data.cnh_validity)}</span>
                </div>
              </div>
            </section>
          )}

           {!hasVehicle && (
             <section className={styles.section}>
               <h3 className={styles.sectionTitle}>
                 <Truck size={16} />
                 {isPt ? "Transporte" : "Transport"}
               </h3>
               <div className={styles.infoBox}>
                 {isPt ? "Acesso sem veículo (Pedestre)" : "Access without vehicle (Pedestrian)"}
               </div>
             </section>
           )}

        </div>
      </div>
    </div>
  );
}