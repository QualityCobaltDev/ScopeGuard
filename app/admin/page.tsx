import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthed = await isAdminAuthenticated();
  return isAuthed ? <AdminDashboard /> : <AdminLogin />;
}
