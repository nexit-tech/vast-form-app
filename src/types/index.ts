export type ActionType = 
  | "" 
  | "Tripulante - Embarque" 
  | "Tripulante - Desembarque" 
  | "Visitante" 
  | "Serviço de Manutenção";

export type YesNo = "" | "Sim" | "Não";

export interface AccessFormData {
  // Dados Gerais
  vessel: string;        // Embarcação
  company: string;       // Empresa
  fullName: string;      // Nome Completo
  documentId: string;    // CPF ou Passaporte
  rg: string;            // RG
  birthDate: string;     // Data de Nascimento
  role: string;          // Cargo
  action: ActionType;    // Ação
  
  // Gatilho Condicional
  hasVehicle: YesNo;     // O veículo irá acessar...?

  // Dados Condicionais (Veículo/Condutor)
  cnhNumber: string;
  cnhValidity: string;
  vehicleModel: string;  // Marca e Modelo
  vehiclePlate: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}