import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getCurrentUser } from "@/lib/user-store";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/signin?next=/admin");
  if (!["owner", "admin"].includes(user.role)) redirect("/unauthorized");
  return <AdminDashboard user={user} />;
}
