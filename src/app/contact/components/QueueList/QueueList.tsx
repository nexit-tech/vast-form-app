"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./QueueList.module.css";

interface QueueItem {
  fullName: string;
  role: string;
  company: string;
}

interface QueueListProps {
  queue: QueueItem[];
  onRemove: (index: number) => void;
  title: string;
  removeText: string;
}

export default function QueueList({ queue, onRemove, title, removeText }: QueueListProps) {
  return (
    <AnimatePresence>
      {queue.length > 0 && (
        <motion.div 
          className={styles.container}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className={styles.header}>
            <span className={styles.title}>
              {title} ({queue.length})
            </span>
          </div>
          {queue.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.name}>{item.fullName}</span>
                <span className={styles.role}>{item.role} • {item.company}</span>
              </div>
              <button 
                type="button" 
                onClick={() => onRemove(index)}
                className={styles.removeBtn}
              >
                {removeText}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}