"use client";

import { useState } from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import Input from "./components/Input/Input";
import Select from "./components/Select/Select";
import DatePicker from "./components/DatePicker/DatePicker";
import Button from "./components/Button/Button";
import BackButton from "./components/BackButton/BackButton";
import SuccessView from "./components/SuccessView/SuccessView";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";
import QueueList from "./components/QueueList/QueueList";
import styles from "./page.module.css";

export default function AccessPage() {
  const { dict, language } = useLanguage();
  const isPt = language === "pt";
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    formData,
    queue,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleAddToQueue,
    handleRemoveFromQueue,
    handleSubmit,
    handleSubmitQueue,
  } = useContactForm(dict);

  const isLocked = queue.length > 0;

  if (isSuccess) {
    return (
      <main className={styles.container}>
        <nav className={styles.nav}>
           <BackButton />
        </nav>
        <SuccessView userName={queue.length > 0 ? `${queue.length} pessoas` : formData.fullName} />
      </main>
    );
  }

  const onAddToList = () => {
    const added = handleAddToQueue(true);
    if (added) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onPreSubmit = () => {
    if (queue.length > 0) {
      setShowConfirmModal(true);
    } else {
      handleSubmit({ preventDefault: () => {} } as any);
    }
  };

  const onConfirmSubmission = async () => {
    await handleSubmitQueue();
    setShowConfirmModal(false);
  };

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <BackButton />
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{dict.form.title}</h1>
        <p className={styles.subtitle}>{dict.form.subtitle}</p>
      </header>

      <QueueList 
        queue={queue} 
        onRemove={handleRemoveFromQueue}
        title={isPt ? "Lista de Envio" : "Submission List"}
        removeText={isPt ? "Remover" : "Remove"}
      />
      
      <form className={styles.form} onSubmit={(e) => e.preventDefault()} noValidate>
        <section className={styles.section}>
          <div className={isLocked ? styles.lockedGroup : ""}>
            <Input
              label={dict.form.vessel}
              name="vessel"
              placeholder={dict.form.vessel}
              value={formData.vessel}
              onChange={handleChange}
              error={errors.vessel}
            />

            <Input
              label={dict.form.company}
              name="company"
              placeholder={dict.form.company}
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
            />
          </div>

          <Input
            label={dict.form.fullName}
            name="fullName"
            placeholder={dict.form.fullName}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <div className={styles.row}>
            <Input
              label={dict.form.documentId}
              name="documentId"
              placeholder={dict.form.documentIdPlaceholder}
              value={formData.documentId}
              onChange={handleChange}
              error={errors.documentId}
            />
            <Input
              label={dict.form.rg}
              name="rg"
              placeholder={dict.form.rgPlaceholder}
              value={formData.rg}
              onChange={handleChange}
              error={errors.rg}
            />
          </div>

          <div className={styles.row}>
            <DatePicker
              label={dict.form.birthDate}
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
            />
            <Input
              label={dict.form.role}
              name="role"
              placeholder={dict.form.role}
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
            />
          </div>
        </section>

        <section className={styles.section}>
          <Select 
            label={dict.form.action}
            name="action"
            value={formData.action}
            onChange={handleChange}
            error={errors.action}
            options={[
              { label: dict.options.action.embark, value: "Tripulante - Embarque" },
              { label: dict.options.action.disembark, value: "Tripulante - Desembarque" },
              { label: dict.options.action.visitor, value: "Visitante" },
              { label: dict.options.action.maintenance, value: "Serviço de Manutenção" },
            ]}
          />
        </section>

        <section className={styles.section}>
          <Select 
            label={dict.form.hasVehicle}
            name="hasVehicle"
            value={formData.hasVehicle}
            onChange={handleChange}
            error={errors.hasVehicle}
            options={[
              { label: dict.options.yesNo.yes, value: "Sim" },
              { label: dict.options.yesNo.no, value: "Não" },
            ]}
          />
        </section>

        <AnimatePresence>
          {formData.hasVehicle === "Sim" && (
            <motion.section 
              className={styles.section}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={styles.sectionTitle}>{dict.form.vehicleSection}</h3>
              
              <div className={styles.row}>
                <Input
                  label={dict.form.cnhNumber}
                  name="cnhNumber"
                  placeholder={dict.form.cnhNumberPlaceholder}
                  value={formData.cnhNumber}
                  onChange={handleChange}
                  error={errors.cnhNumber}
                />
                <DatePicker
                  label={dict.form.cnhValidity}
                  name="cnhValidity"
                  value={formData.cnhValidity}
                  onChange={handleChange}
                  error={errors.cnhValidity}
                />
              </div>

              <div className={styles.row}>
                <Input
                  label={dict.form.vehicleModel}
                  name="vehicleModel"
                  placeholder="Ex: Fiat Uno"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  error={errors.vehicleModel}
                />
                <Input
                  label={dict.form.vehiclePlate}
                  name="vehiclePlate"
                  placeholder="ABC-1234"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  error={errors.vehiclePlate}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className={styles.footer}>
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.addButton}
              onClick={onAddToList}
            >
              {isPt ? "+ Adicionar à Lista (Mesma Empresa)" : "+ Add to List (Same Company)"}
            </button>

            <Button 
              type="button" 
              isLoading={isSubmitting}
              onClick={onPreSubmit}
            >
              {isSubmitting 
                ? dict.form.loading 
                : queue.length > 0 
                  ? (isPt ? `Enviar Lista (${queue.length})` : `Submit List (${queue.length})`)
                  : dict.form.submit
              }
            </Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={onConfirmSubmission}
        isLoading={isSubmitting}
        title={isPt ? "Confirmar Envio em Massa" : "Confirm Bulk Submission"}
        message={
          <>
            <p>
              {isPt 
                ? `Você está prestes a enviar o cadastro de ${queue.length} pessoas para:` 
                : `You are about to submit access requests for ${queue.length} people to:`}
            </p>
            <p style={{ marginTop: "0.5rem", fontWeight: "bold", color: "#FFF" }}>
               {queue[0]?.company} ({queue[0]?.vessel})
            </p>
            <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
              {isPt 
                ? "Certifique-se de que todos os dados estão corretos." 
                : "Please ensure all data is correct."}
            </p>
          </>
        }
        confirmText={isPt ? "Confirmar e Enviar" : "Confirm and Submit"}
        cancelText={isPt ? "Cancelar" : "Cancel"}
      />
    </main>
  );
}