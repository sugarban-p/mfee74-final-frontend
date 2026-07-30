// Server Component: reads the initial tab from the URL before dashboard UI hydrates.
import DashboardClient from '../../../components/member/dashboard-client';

interface DashboardPageProps {
  searchParams?: Promise<{
    tab?: string | string[];
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialTab = Array.isArray(params.tab)
    ? (params.tab[0] ?? null)
    : (params.tab ?? null);

  return <DashboardClient initialTab={initialTab} />;
}
