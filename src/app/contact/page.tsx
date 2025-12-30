"use client";

import { useAccessForm } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import Input from "./components/Input/Input";
import Select from "./components/Select/Select";
import DatePicker from "./components/DatePicker/DatePicker";
import Button from "./components/Button/Button";
import BackButton from "./components/BackButton/BackButton";
import SuccessView from "./components/SuccessView/SuccessView";
import styles from "./page.module.css";

export default function AccessPage() {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  } = useAccessForm();

  if (isSuccess) {
    return (
      <main className={styles.container}>
        <nav className={styles.nav}>
           <BackButton />
        </nav>
        <SuccessView userName={formData.fullName} />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <BackButton />
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>ACESSO</h1>
        <p className={styles.subtitle}>Preencha os dados do visitante ou tripulante.</p>
      </header>
      
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <Input
            label="Embarcação"
            name="vessel"
            placeholder="Nome da embarcação"
            value={formData.vessel}
            onChange={handleChange}
            error={errors.vessel}
          />

          <Input
            label="Empresa"
            name="company"
            placeholder="Empresa do visitante"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
          />

          <Input
            label="Nome Completo"
            name="fullName"
            placeholder="Conforme documento"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <div className={styles.row}>
            <Input
              label="CPF ou Passaporte"
              name="documentId"
              placeholder="000.000.000-00"
              value={formData.documentId}
              onChange={handleChange}
              error={errors.documentId}
            />
            <Input
              label="RG"
              name="rg"
              placeholder="Número RG"
              value={formData.rg}
              onChange={handleChange}
              error={errors.rg}
            />
          </div>

          <div className={styles.row}>
            <DatePicker
              label="Data de Nascimento"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
            />
            <Input
              label="Cargo"
              name="role"
              placeholder="Função"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
            />
          </div>
        </section>

        <section className={styles.section}>
          <Select 
            label="Tipo de Ação / Acesso"
            name="action"
            value={formData.action}
            onChange={handleChange}
            error={errors.action}
            options={[
              { label: "Tripulante - Embarque", value: "Tripulante - Embarque" },
              { label: "Tripulante - Desembarque", value: "Tripulante - Desembarque" },
              { label: "Visitante", value: "Visitante" },
              { label: "Serviço de Manutenção", value: "Serviço de Manutenção" },
            ]}
          />
        </section>

        <section className={styles.section}>
          <Select 
            label="O veículo irá acessar o Terminal e é o condutor?"
            name="hasVehicle"
            value={formData.hasVehicle}
            onChange={handleChange}
            error={errors.hasVehicle}
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Não" },
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
              <h3 className={styles.sectionTitle}>Dados do Veículo</h3>
              
              <div className={styles.row}>
                <Input
                  label="Número da CNH"
                  name="cnhNumber"
                  placeholder="Registro CNH"
                  value={formData.cnhNumber}
                  onChange={handleChange}
                  error={errors.cnhNumber}
                />
                <DatePicker
                  label="Validade CNH"
                  name="cnhValidity"
                  value={formData.cnhValidity}
                  onChange={handleChange}
                  error={errors.cnhValidity}
                />
              </div>

              <div className={styles.row}>
                <Input
                  label="Marca e Modelo"
                  name="vehicleModel"
                  placeholder="Ex: Fiat Uno"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  error={errors.vehicleModel}
                />
                <Input
                  label="Placa do Veículo"
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
          <Button type="submit" isLoading={isSubmitting}>
            Registrar Acesso
          </Button>
        </div>
      </form>
    </main>
  );
}