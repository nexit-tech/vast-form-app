import { useState, ChangeEvent, FormEvent } from "react";
import { FormData, FormErrors } from "@/types";

const initialData: FormData = {
  fullName: "",
  email: "",
  companyName: "",
  message: "",
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "O nome completo é obrigatório";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "A mensagem é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
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
        setFormData(initialData);
        setIsSuccess(true);
      } catch (error) {
        console.error(error);
      }
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