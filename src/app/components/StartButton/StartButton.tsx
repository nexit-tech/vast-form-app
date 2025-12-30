"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./StartButton.module.css";

interface StartButtonProps {
  href: string;
  label: string;
}

export default function StartButton({ href, label }: StartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    router.push(href);
  };

  const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 25px 50px rgba(53, 46, 242, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { 
      scale: 0.96, 
      transition: { type: "spring", stiffness: 400, damping: 15 } 
    }
  };

  const iconVariants: Variants = {
    initial: { x: 0 },
    hover: { 
      x: 4, 
      transition: { repeat: Infinity, repeatType: "reverse", duration: 0.6, ease: "easeInOut" } 
    }
  };

  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const speedLineVariants: Variants = {
    animate: (custom: number) => ({
      x: ["150%", "-150%"],
      transition: {
        duration: custom,
        repeat: Infinity,
        ease: "linear",
      }
    })
  };

  return (
    <>
      <div className={styles.container}>
        <motion.button
          className={styles.button}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={handleClick}
          disabled={isLoading}
        >
          <span>{label}</span>
          <motion.div className={styles.iconContainer}>
            <motion.div variants={iconVariants}>
              <ArrowRight size={24} strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.button>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className={styles.loaderOverlay}
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className={styles.destinationGlow} />

              <div className={styles.roadContainer}>
                <motion.div 
                  className={styles.speedLine} 
                  style={{ width: "70%", alignSelf: "flex-end", opacity: 0.7 }}
                  variants={speedLineVariants}
                  animate="animate"
                  custom={0.9}
                />
                <motion.div 
                  className={styles.speedLine} 
                  style={{ width: "90%", alignSelf: "flex-start" }}
                  variants={speedLineVariants}
                  animate="animate"
                  custom={1.4}
                />
                 <motion.div 
                  className={styles.speedLine} 
                  style={{ width: "50%", alignSelf: "center", opacity: 0.5 }}
                  variants={speedLineVariants}
                  animate="animate"
                  custom={0.7}
                />
                <motion.div 
                  className={styles.speedLine} 
                  style={{ width: "80%", alignSelf: "flex-end", opacity: 0.8 }}
                  variants={speedLineVariants}
                  animate="animate"
                  custom={1.1}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}