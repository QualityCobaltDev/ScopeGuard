import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user-store";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { isAdminRole } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/signin");
  if (isAdminRole(user.role)) redirect("/admin");
  return <div className="container py-10"><UserDashboard user={user} /></div>;
}
