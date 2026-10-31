import DashboardEntriesClient from "@/components/DashboardClient";

export const metadata = {
  title: 'Manage Entries | Codewalk Author Dashboard',
  description: 'View, edit, and delete all blog articles, project showcases, and gallery snapshots from your author dashboard.',
};

export default function DashboardEntriesPage() {
  return <DashboardEntriesClient />;
}