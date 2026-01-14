"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import StartButton from "./components/StartButton/StartButton";
import Background from "./components/Background/Background";
import styles from "./page.module.css";

export default function Home() {
  const { dict, language, setLanguage } = useLanguage();

  return (
    <main className={styles.main}>
      <Background />

      <div className={styles.contentWrapper} key={language}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            {language === "pt" ? "Formulário de Acesso" : "Access Form"}
          </span>
          <h1 className={styles.title}>
            PORT<br />
            ACCESS
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
              <Image 
                src="/images/br.png" 
                alt="Bandeira do Brasil" 
                fill
                className={styles.flagImage}
                sizes="48px"
              />
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`${styles.flagBtn} ${language === "en" ? styles.active : ""}`}
              title="English"
              type="button"
            >
              <Image 
                src="/images/us.png" 
                alt="USA Flag" 
                fill
                className={styles.flagImage}
                sizes="48px"
              />
            </button>
          </div>
          
          <StartButton href="/contact" text={dict.home.start} />
        </footer>
      </div>
    </main>
  );
}