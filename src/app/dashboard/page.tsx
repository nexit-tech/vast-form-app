import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "./components/SignOutButton/SignOutButton";
import DashboardList from "./components/DashboardList/DashboardList";
import SearchFilters from "./components/SearchFilters/SearchFilters";
import Pagination from "./components/Pagination/Pagination";
import styles from "./page.module.css";

const ITEMS_PER_PAGE = 10;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    status?: string;
    sort?: string;
    order?: string;
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
  const status = searchParams?.status || "all";
  const rawSort = searchParams?.sort || "created_at";
  const order = searchParams?.order || "desc";
  const currentPage = Number(searchParams?.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const validSortColumns = [
    "created_at", 
    "full_name", 
    "company", 
    "role", 
    "status", 
    "vessel", 
    "document_id"
  ];
  const sort = validSortColumns.includes(rawSort) ? rawSort : "created_at";

  let dbQuery = supabase
    .from("access_requests")
    .select("*", { count: "exact" });

  if (query) {
    dbQuery = dbQuery.or(
      `full_name.ilike.%${query}%,company.ilike.%${query}%,document_id.ilike.%${query}%,vessel.ilike.%${query}%`
    );
  }

  if (status && status !== "all") {
    dbQuery = dbQuery.eq("status", status);
  }

  const isAscending = order === "asc";
  dbQuery = dbQuery.order(sort, { ascending: isAscending });
  dbQuery = dbQuery.range(offset, offset + ITEMS_PER_PAGE - 1);
  const { data: requests, count, error } = await dbQuery;

  if (error) {
    console.error("Error fetching requests:", error);
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>DASHBOARD</h1>
          <p className={styles.subtitle}>
            Visão Geral de Solicitações
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
            {query || status !== "all"
              ? "Nenhum resultado encontrado para os filtros aplicados."
              : "Nenhum registro de acesso encontrado."}
          </p>
        </div>
      )}
    </main>
  );
}