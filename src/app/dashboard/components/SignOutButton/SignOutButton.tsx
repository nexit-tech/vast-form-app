"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./SignOutButton.module.css";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <button onClick={handleSignOut} className={styles.button}>
      Sair
    </button>
  );
}