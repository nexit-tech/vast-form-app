"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { useClickOutside } from "@/hooks";
import styles from "./Select.module.css";

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  options: { label: string; value: string }[];
  error?: string;
}

export default function Select({ label, name, value, onChange, options, error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (optionValue: string) => {
    const event = {
      target: { name, value: optionValue },
    };
    onChange(event);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const dropdownVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div 
      className={styles.container} 
      ref={containerRef}
      style={{ zIndex: isOpen ? 50 : 1 }}
    >
      <label className={styles.label}>{label}</label>

      <div 
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : styles.placeholder}>
          {selectedLabel || "Selecione uma opção"}
        </span>
        <ChevronDown 
          className={`${styles.iconChevron} ${isOpen ? styles.iconRotate : ""}`} 
          size={20} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.dropdown}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className={styles.optionsList}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`${styles.optionItem} ${value === option.value ? styles.optionSelected : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                  {value === option.value && <Check className={styles.checkIcon} />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className={styles.errorMessage}
        >
          <AlertCircle size={12} /> {error}
        </motion.span>
      )}
    </div>
  );
}