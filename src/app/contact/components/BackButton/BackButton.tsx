"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";

export default function BackButton() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = async () => {
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/");
  };

  const buttonVariants: Variants = {
    initial: { scale: 1 },
    tap: { scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.3)" },
    hover: { x: -3 }
  };

  const fadeVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { duration: 0.4, ease: "easeInOut" } 
    },
    exit: { opacity: 0 }
  };

  return (
    <>
      <div className={styles.container}>
        <motion.div
          className={styles.button}
          onClick={handleClick}
          variants={buttonVariants}
          initial="initial"
          whileTap="tap"
          whileHover="hover"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </motion.div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isNavigating && (
            <motion.div 
              className={styles.fadeOverlay}
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}