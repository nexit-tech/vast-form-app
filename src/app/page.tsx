"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import StartButton from "./components/StartButton/StartButton";
import styles from "./page.module.css";

export default function Home() {
  const { dict, language, setLanguage } = useLanguage();

  return (
    <main className={styles.main}>
      <div className={styles.topRightLogo}>
        <Image
          src="/images/vastbanner.png"
          alt="Vast Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      <header className={styles.header}>
        <span className={styles.eyebrow}>
          {language === "pt" ? "Formulário de Acesso" : "Access Form"}
        </span>
        <h1 className={styles.title}>
          VAST<br />
          FORM
        </h1>
        <p className={styles.subtitle}>
          {dict.home.subtitle}
        </p>
      </header>

      <footer className={styles.footer}>
        <div className={styles.languageSwitch}>
          <button
            onClick={() => setLanguage("pt")}
            className={`${styles.flagBtn} ${language === "pt" ? styles.active : ""}`}
            title="Português"
            type="button"
          >
            🇧🇷
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`${styles.flagBtn} ${language === "en" ? styles.active : ""}`}
            title="English"
            type="button"
          >
            🇺🇸
          </button>
        </div>
        
        <StartButton href="/contact" text={dict.home.start} />
      </footer>
    </main>
  );
}