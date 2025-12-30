export type ActionType = 
  | "" 
  | "Tripulante - Embarque" 
  | "Tripulante - Desembarque" 
  | "Visitante" 
  | "Serviço de Manutenção";

export type YesNo = "" | "Sim" | "Não";

export interface AccessFormData {
  vessel: string;
  company: string;
  fullName: string;
  documentId: string;
  rg: string;
  birthDate: string;
  role: string;
  action: ActionType;
  hasVehicle: YesNo;
  cnhNumber: string;
  cnhValidity: string;
  vehicleModel: string;
  vehiclePlate: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export type Language = "pt" | "en";

export interface Translation {
  home: {
    start: string;
    subtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    vessel: string;
    company: string;
    fullName: string;
    documentId: string;
    documentIdPlaceholder: string;
    rg: string;
    rgPlaceholder: string;
    birthDate: string;
    birthDatePlaceholder: string;
    role: string;
    action: string;
    hasVehicle: string;
    vehicleSection: string;
    cnhNumber: string;
    cnhNumberPlaceholder: string;
    cnhValidity: string;
    vehicleModel: string;
    vehiclePlate: string;
    submit: string;
    loading: string;
  };
  options: {
    action: {
      embark: string;
      disembark: string;
      visitor: string;
      maintenance: string;
    };
    yesNo: {
      yes: string;
      no: string;
    };
  };
  errors: {
    required: string;
    email: string;
    vessel: string;
    company: string;
    fullName: string;
    documentId: string;
    rg: string;
    birthDate: string;
    role: string;
    action: string;
    hasVehicle: string;
    cnhNumber: string;
    cnhValidity: string;
    vehicleModel: string;
    vehiclePlate: string;
  };
  success: {
    title: string;
    message: string;
    back: string;
  };
}