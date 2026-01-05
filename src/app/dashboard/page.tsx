import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "./components/SignOutButton/SignOutButton";
import DashboardList from "./components/DashboardList/DashboardList";
import SearchFilters from "./components/SearchFilters/SearchFilters";
import Pagination from "./components/Pagination/Pagination";
import styles from "./page.module.css";

const ITEMS_PER_PAGE = 6;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let dbQuery = supabase
    .from("access_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  if (query) {
    dbQuery = dbQuery.or(
      `full_name.ilike.%${query}%,company.ilike.%${query}%,document_id.ilike.%${query}%,vessel.ilike.%${query}%`
    );
  }

  const { data: requests, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching requests:", error);
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>DASHBOARD</h1>
          <p className={styles.subtitle}>
            Monitoramento de Acessos
          </p>
        </div>
        <SignOutButton />
      </header>
      <SearchFilters />

      {requests && requests.length > 0 ? (
        <>
          <DashboardList requests={requests} />
          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <div className={styles.emptyState}>
          <p>
            {query 
              ? `Nenhum resultado encontrado para "${query}"`
              : "Nenhum registro de acesso encontrado."}
          </p>
        </div>
      )}
    </main>
  );
}