import Image from "next/image";
import StartButton from "./components/StartButton/StartButton";
import styles from "./page.module.css";

export default function Home() {
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
        <span className={styles.eyebrow}>Formulário de Acesso</span>
        <h1 className={styles.title}>
          VAST<br />
          FORM
        </h1>
        <p className={styles.subtitle}>
          Agilize seu processo de entrada no terminal.
        </p>
      </header>

      <footer className={styles.footer}>
        <StartButton href="/contact" label="Iniciar Cadastro" />
      </footer>
    </main>
  );
}