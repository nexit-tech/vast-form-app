"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BackButton from "../contact/components/BackButton/BackButton";
import Input from "../contact/components/Input/Input";
import Button from "../contact/components/Button/Button";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.refresh();
      router.push("/dashboard");
      
    } catch (err: any) {
      setError("Email ou senha incorretos.");
      console.error("Login error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <BackButton />
      </nav>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>ADMIN<br />ACCESS</h1>
          <p className={styles.subtitle}>Acesso restrito à gestão portuária</p>
        </header>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Input
            label="E-mail Corporativo"
            name="email"
            type="email"
            placeholder="admin@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error=""
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error=""
          />

          <Button type="submit" isLoading={isLoading}>
            {isLoading ? "Entrando..." : "Acessar Painel"}
          </Button>
        </form>
      </div>
    </main>
  );
}