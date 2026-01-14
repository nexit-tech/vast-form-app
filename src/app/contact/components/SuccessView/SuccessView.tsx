"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./SuccessView.module.css";

interface SuccessViewProps {
  userName: string;
}

export default function SuccessView({ userName }: SuccessViewProps) {
  const { dict } = useLanguage();

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div 
          className={styles.iconCircle}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
        >
          <svg className={styles.checkSvg} viewBox="0 0 24 24">
            <motion.path 
              d="M20 6L9 17L4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            />
          </svg>
        </motion.div>

        <h2 className={styles.title}>{dict.success.title}</h2>
        
        <p className={styles.text}>
          {dict.success.message}
        </p>
      </motion.div>
    </div>
  );
}