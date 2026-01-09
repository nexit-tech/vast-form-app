import { useState, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface ContactFormData {
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
}

const initialState: ContactFormData = {
  vessel: "",
  company: "",
  fullName: "",
  documentId: "",
  rg: "",
  birthDate: "",
  role: "",
  action: "",
  hasVehicle: "Não",
  cnhNumber: "",
  cnhValidity: "",
  vehicleModel: "",
  vehiclePlate: "",
};

type SyntheticEvent = 
  | ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | { target: { name: string; value: string } };

export const useContactForm = (dict: any) => {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<ContactFormData>(initialState);
  const [queue, setQueue] = useState<ContactFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (data: ContactFormData) => {
    const newErrors: Record<string, string> = {};

    if (!data.vessel) newErrors.vessel = dict?.form?.required || "Required";
    if (!data.company) newErrors.company = dict?.form?.required || "Required";
    if (!data.fullName) newErrors.fullName = dict?.form?.required || "Required";
    if (!data.documentId) newErrors.documentId = dict?.form?.required || "Required";
    if (!data.rg) newErrors.rg = dict?.form?.required || "Required";
    if (!data.birthDate) newErrors.birthDate = dict?.form?.required || "Required";
    if (!data.role) newErrors.role = dict?.form?.required || "Required";
    if (!data.action) newErrors.action = dict?.form?.required || "Required";
    if (!data.hasVehicle) newErrors.hasVehicle = dict?.form?.required || "Required";

    if (data.hasVehicle === "Sim") {
      if (!data.cnhNumber) newErrors.cnhNumber = dict?.form?.required || "Required";
      if (!data.cnhValidity) newErrors.cnhValidity = dict?.form?.required || "Required";
      if (!data.vehicleModel) newErrors.vehicleModel = dict?.form?.required || "Required";
      if (!data.vehiclePlate) newErrors.vehiclePlate = dict?.form?.required || "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: SyntheticEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddToQueue = (keepCommonData: boolean = true) => {
    if (validateForm(formData)) {
      setQueue((prev) => [...prev, formData]);
      
      if (keepCommonData) {
        setFormData((prev) => ({
          ...initialState,
          vessel: prev.vessel,
          company: prev.company,
          action: prev.action,
          hasVehicle: prev.hasVehicle,
          vehicleModel: prev.vehicleModel,
          vehiclePlate: prev.vehiclePlate,
          cnhNumber: prev.cnhNumber,
          cnhValidity: prev.cnhValidity,
        }));
      } else {
        setFormData(initialState);
      }
      return true;
    }
    return false;
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm(formData)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("access_requests")
        .insert([
          {
            vessel: formData.vessel,
            company: formData.company,
            full_name: formData.fullName,
            document_id: formData.documentId,
            rg: formData.rg,
            birth_date: formData.birthDate,
            role: formData.role,
            action: formData.action,
            has_vehicle: formData.hasVehicle === "Sim",
            cnh_number: formData.cnhNumber || null,
            cnh_validity: formData.cnhValidity || null,
            vehicle_model: formData.vehicleModel || null,
            vehicle_plate: formData.vehiclePlate || null,
          },
        ]);

      if (error) throw error;
      setIsSuccess(true);
      setFormData(initialState);
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQueue = async () => {
    if (queue.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = queue.map(item => ({
        vessel: item.vessel,
        company: item.company,
        full_name: item.fullName,
        document_id: item.documentId,
        rg: item.rg,
        birth_date: item.birthDate,
        role: item.role,
        action: item.action,
        has_vehicle: item.hasVehicle === "Sim",
        cnh_number: item.cnhNumber || null,
        cnh_validity: item.cnhValidity || null,
        vehicle_model: item.vehicleModel || null,
        vehicle_plate: item.vehiclePlate || null,
      }));

      const { error } = await supabase
        .from("access_requests")
        .insert(payload);

      if (error) throw error;
      setIsSuccess(true);
      setQueue([]);
      setFormData(initialState);

    } catch (error) {
      console.error("Error submitting queue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};