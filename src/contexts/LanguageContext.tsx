"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Language, Translation } from "@/types";

const translations: Record<Language, Translation> = {
  pt: {
    home: {
      start: "INICIAR ACESSO",
      subtitle: "Sistema de Controle de Acesso Portuário",
    },
    form: {
      title: "ACESSO",
      subtitle: "Preencha os dados do visitante ou tripulante.",
      vessel: "Embarcação | TLA (Atividades no Terminal)",
      company: "Empresa",
      fullName: "Nome Completo",
      documentId: "CPF ou Passaporte",
      documentIdPlaceholder: "000.000.000-00",
      rg: "RG",
      rgPlaceholder: "Número RG",
      birthDate: "Data de Nascimento",
      birthDatePlaceholder: "DD/MM/AAAA",
      role: "Cargo",
      action: "Tipo de Ação / Acesso",
      hasVehicle: "O veículo irá acessar o Terminal e é o condutor?",
      vehicleSection: "Dados do Veículo",
      cnhNumber: "Número da CNH",
      cnhNumberPlaceholder: "Registro CNH",
      cnhValidity: "Validade CNH",
      vehicleModel: "Marca e Modelo",
      vehiclePlate: "Placa do Veículo",
      submit: "Registrar Acesso",
      loading: "Enviando...",
    },
    options: {
      action: {
        portCrewEmbark: "Serviços Portuários - Tripulante Embarque",
        portCrewDisembark: "Serviços Portuários - Tripulante Desembarque",
        portOnboardMaintenance: "Serviços Portuários - Manutenção a Bordo",
        portOnboardVisit: "Serviços Portuários - Visita a Bordo",
        tlaMaintenance: "Terminal TLA - Serviços de Manutenção",
        tlaVisit: "Terminal TLA - Visitante",
      },
      yesNo: {
        yes: "Sim",
        no: "Não",
      },
    },
    errors: {
      required: "Campo obrigatório",
      email: "Email inválido",
      vessel: "Embarcação/TLA obrigatória",
      company: "Empresa obrigatória",
      fullName: "Nome completo obrigatório",
      documentId: "CPF/Passaporte obrigatório",
      rg: "RG obrigatório",
      birthDate: "Data obrigatória",
      role: "Cargo obrigatório",
      action: "Selecione o tipo de ação",
      hasVehicle: "Selecione se haverá acesso com veículo",
      cnhNumber: "CNH obrigatória",
      cnhValidity: "Validade da CNH obrigatória",
      vehicleModel: "Modelo do veículo obrigatório",
      vehiclePlate: "Placa obrigatória",
      submit: "Registrar Acesso",
    },
    success: {
      title: "Acesso Registrado!",
      message: "Seu cadastro foi realizado com sucesso. Aguarde a liberação na portaria.",
      back: "Voltar ao Início",
    },
  },
  en: {
    home: {
      start: "START ACCESS",
      subtitle: "Port Access Control System",
    },
    form: {
      title: "ACCESS",
      subtitle: "Fill in the visitor or crew member details.",
      vessel: "Vessel | TLA (Terminal Activities)",
      company: "Company",
      fullName: "Full Name",
      documentId: "Passport / SSN",
      documentIdPlaceholder: "ID Number",
      rg: "ID / Driver's License",
      rgPlaceholder: "ID Number",
      birthDate: "Date of Birth",
      birthDatePlaceholder: "MM/DD/YYYY",
      role: "Job Title / Role",
      action: "Action Type / Access",
      hasVehicle: "Will the vehicle access the Terminal?",
      vehicleSection: "Vehicle Details",
      cnhNumber: "Driver's License Number",
      cnhNumberPlaceholder: "License Number",
      cnhValidity: "License Expiration",
      vehicleModel: "Make and Model",
      vehiclePlate: "License Plate",
      submit: "Register Access",
      loading: "Submitting...",
    },
    options: {
      action: {
        portCrewEmbark: "Port Services - Crew Embarkation",
        portCrewDisembark: "Port Services - Crew Disembarkation",
        portOnboardMaintenance: "Port Services - Onboard Maintenance",
        portOnboardVisit: "Port Services - Onboard Visit",
        tlaMaintenance: "TLA Terminal - Maintenance Services",
        tlaVisit: "TLA Terminal - Visit",
      },
      yesNo: {
        yes: "Yes",
        no: "No",
      },
    },
    errors: {
      required: "Field required",
      email: "Invalid email",
      vessel: "Vessel/TLA is required",
      company: "Company is required",
      fullName: "Full name is required",
      documentId: "Passport/SSN is required",
      rg: "ID is required",
      birthDate: "Date is required",
      role: "Role is required",
      action: "Select action type",
      hasVehicle: "Select if there is vehicle access",
      cnhNumber: "License number is required",
      cnhValidity: "License expiration is required",
      vehicleModel: "Vehicle model is required",
      vehiclePlate: "License plate is required",
      submit: "Register Access",
    },
    success: {
      title: "Access Registered!",
      message: "Your registration was successful. Please wait for clearance at the gate.",
      back: "Back to Home",
    },
  },
};

interface LanguageContextType {
  language: Language;
  dict: Translation;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  return (
    <LanguageContext.Provider value={{ language, dict: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}