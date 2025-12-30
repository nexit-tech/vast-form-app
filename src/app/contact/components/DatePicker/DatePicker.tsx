"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  range, 
  formatDate, 
  parseDate, 
  formatDisplayDate 
} from "@/utils/date";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  error?: string;
}

type ViewMode = "days" | "months" | "years";

export default function DatePicker({ label, name, value, onChange, error }: DatePickerProps) {
  const { language, dict } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const [mounted, setMounted] = useState(false);
  
  const initialDate = parseDate(value) || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    setMounted(true);
  }, []);

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const days = range(1, daysInMonth);
  const emptyDays = range(0, firstDay - 1);
  const currentYear = new Date().getFullYear();
  const years = range(1920, currentYear + 10).reverse();

  const monthNames = language === "pt" 
    ? ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekDays = language === "pt" 
    ? ["D", "S", "T", "Q", "Q", "S", "S"]
    : ["S", "M", "T", "W", "T", "F", "S"];

  const handleSelectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const dateString = formatDate(date);
    onChange({ target: { name, value: dateString } });
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    let newMonth = viewMonth + offset;
    let newYear = viewYear;
    if (newMonth > 11) { newMonth = 0; newYear += 1; } 
    else if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selected = parseDate(value);
    return selected?.getDate() === day && selected?.getMonth() === viewMonth && selected?.getFullYear() === viewYear;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 350 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  };

  const slideVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      
      <div className={styles.trigger} onClick={() => setIsOpen(true)}>
        <span className={value ? "" : styles.placeholder}>
          {value ? formatDisplayDate(value, language) : dict.form.birthDatePlaceholder}
        </span>
        <CalendarIcon size={20} color="white" style={{ opacity: 0.8 }} />
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className={styles.backdrop}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                className={styles.calendar}
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} 
              >
                <div className={styles.header}>
                  {viewMode === "days" && (
                    <button type="button" onClick={() => changeMonth(-1)} className={styles.navButton}>
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  
                  <div className={styles.headerTitles}>
                    <button 
                      type="button" 
                      className={`${styles.titleBtn} ${viewMode === "months" ? styles.titleBtnActive : ""}`}
                      onClick={() => setViewMode(viewMode === "months" ? "days" : "months")}
                    >
                      {monthNames[viewMonth]}
                    </button>
                    
                    <button 
                      type="button" 
                      className={`${styles.titleBtn} ${viewMode === "years" ? styles.titleBtnActive : ""}`}
                      onClick={() => setViewMode(viewMode === "years" ? "days" : "years")}
                    >
                      {viewYear}
                    </button>
                  </div>

                  {viewMode === "days" && (
                    <button type="button" onClick={() => changeMonth(1)} className={styles.navButton}>
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {viewMode === "days" && (
                    <motion.div key="days" variants={slideVariants} initial="initial" animate="animate" exit="exit">
                      <div className={styles.weekGrid}>
                        {weekDays.map((d, i) => (
                          <div key={`${d}-${i}`} className={styles.weekDay}>{d}</div>
                        ))}
                      </div>
                      <div className={styles.daysGrid}>
                        {emptyDays.map((_, i) => <div key={`empty-${i}`} className={styles.dayEmpty} />)}
                        {days.map((day) => (
                          <button
                            key={`day-${day}`}
                            type="button"
                            className={`${styles.day} ${isSelected(day) ? styles.daySelected : ""} ${isToday(day) ? styles.dayToday : ""}`}
                            onClick={() => handleSelectDay(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {viewMode === "months" && (
                    <motion.div key="months" className={styles.selectionGrid} variants={slideVariants} initial="initial" animate="animate" exit="exit">
                      {monthNames.map((m, i) => (
                        <div 
                          key={m} 
                          className={`${styles.selectionItem} ${i === viewMonth ? styles.selectionActive : ""}`}
                          onClick={() => { setViewMonth(i); setViewMode("days"); }}
                        >
                          {m.substring(0, 3)}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {viewMode === "years" && (
                    <motion.div key="years" className={styles.selectionGrid} variants={slideVariants} initial="initial" animate="animate" exit="exit">
                      {years.map((y) => (
                        <div 
                          key={y} 
                          className={`${styles.selectionItem} ${y === viewYear ? styles.selectionActive : ""}`}
                          onClick={() => { setViewYear(y); setViewMode("days"); }}
                        >
                          {y}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

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