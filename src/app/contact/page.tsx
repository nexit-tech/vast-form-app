"use client";

import { useAccessForm } from "@/hooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import Input from "./components/Input/Input";
import Select from "./components/Select/Select";
import DatePicker from "./components/DatePicker/DatePicker";
import Button from "./components/Button/Button";
import BackButton from "./components/BackButton/BackButton";
import SuccessView from "./components/SuccessView/SuccessView";
import styles from "./page.module.css";

export default function AccessPage() {
  const { dict } = useLanguage();
  
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  } = useAccessForm(dict);

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
        <h1 className={styles.title}>{dict.form.title}</h1>
        <p className={styles.subtitle}>{dict.form.subtitle}</p>
      </header>
      
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
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
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? dict.form.loading : dict.form.submit}
          </Button>
        </div>
      </form>
    </main>
  );
}