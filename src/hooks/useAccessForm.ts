import { useState, FormEvent } from "react";
import { AccessFormData, FormErrors, Translation } from "@/types";
import { supabase } from "@/lib/supabase";

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

const formatDateToDB = (dateString: string): string | null => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  if (!day || !month || !year) return null;
  return `${year}-${month}-${day}`;
};

interface FieldChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

export const useAccessForm = (dict: Translation) => {
  const [formData, setFormData] = useState<AccessFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    const errorDict = dict.errors;

    if (!formData.vessel.trim()) newErrors.vessel = errorDict.vessel;
    if (!formData.company.trim()) newErrors.company = errorDict.company;
    if (!formData.fullName.trim()) newErrors.fullName = errorDict.fullName;
    if (!formData.documentId.trim()) newErrors.documentId = errorDict.documentId;
    if (!formData.rg.trim()) newErrors.rg = errorDict.rg;
    if (!formData.birthDate.trim()) newErrors.birthDate = errorDict.birthDate;
    if (!formData.role.trim()) newErrors.role = errorDict.role;
    if (!formData.action) newErrors.action = errorDict.action;
    if (!formData.hasVehicle) newErrors.hasVehicle = errorDict.hasVehicle;
    
    if (formData.hasVehicle === "Sim") {
      if (!formData.cnhNumber.trim()) newErrors.cnhNumber = errorDict.cnhNumber;
      if (!formData.cnhValidity.trim()) newErrors.cnhValidity = errorDict.cnhValidity;
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = errorDict.vehicleModel;
      if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = errorDict.vehiclePlate;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) isValid = false;
    return isValid;
  };

  const handleChange = (e: FieldChangeEvent) => {
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
        const { error } = await supabase.from("access_requests").insert([
          {
            vessel: formData.vessel,
            company: formData.company,
            full_name: formData.fullName,
            document_id: formData.documentId,
            rg: formData.rg,
            birth_date: formatDateToDB(formData.birthDate),
            role: formData.role,
            action: formData.action,
            has_vehicle: formData.hasVehicle,
            cnh_number: formData.hasVehicle === "Sim" ? formData.cnhNumber : null,
            cnh_validity: formData.hasVehicle === "Sim" ? formatDateToDB(formData.cnhValidity) : null,
            vehicle_model: formData.hasVehicle === "Sim" ? formData.vehicleModel : null,
            vehicle_plate: formData.hasVehicle === "Sim" ? formData.vehiclePlate : null,
          },
        ]);

        if (error) throw error;

        setFormData(initialData);
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Erro ao enviar. Tente novamente.");
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