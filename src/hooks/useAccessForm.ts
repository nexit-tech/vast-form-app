import { useState, ChangeEvent, FormEvent } from "react";
import { AccessFormData, FormErrors } from "@/types";

const initialData: AccessFormData = {
  vessel: "",
  company: "",
  fullName: "",
  documentId: "",
  rg: "",
  birthDate: "",
  role: "",
  action: "",
  hasVehicle: "",
  cnhNumber: "",
  cnhValidity: "",
  vehicleModel: "",
  vehiclePlate: "",
};

export const useAccessForm = () => {
  const [formData, setFormData] = useState<AccessFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.vessel.trim()) newErrors.vessel = "Embarcação obrigatória";
    if (!formData.company.trim()) newErrors.company = "Empresa obrigatória";
    if (!formData.fullName.trim()) newErrors.fullName = "Nome completo obrigatório";
    if (!formData.documentId.trim()) newErrors.documentId = "CPF/Passaporte obrigatório";
    if (!formData.rg.trim()) newErrors.rg = "RG obrigatório";
    if (!formData.birthDate.trim()) newErrors.birthDate = "Data obrigatória";
    if (!formData.role.trim()) newErrors.role = "Cargo obrigatório";
    if (!formData.action) newErrors.action = "Selecione o tipo de ação";
    if (!formData.hasVehicle) newErrors.hasVehicle = "Selecione se haverá acesso com veículo";
    if (formData.hasVehicle === "Sim") {
      if (!formData.cnhNumber.trim()) newErrors.cnhNumber = "CNH obrigatória";
      if (!formData.cnhValidity.trim()) newErrors.cnhValidity = "Validade da CNH obrigatória";
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = "Modelo do veículo obrigatório";
      if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = "Placa obrigatória";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) isValid = false;
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "hasVehicle" && value === "Não") {
        newData.cnhNumber = "";
        newData.cnhValidity = "";
        newData.vehicleModel = "";
        newData.vehiclePlate = "";
      }
      
      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    if (validate()) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Dados enviados:", formData);
        setFormData(initialData);
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  };
};