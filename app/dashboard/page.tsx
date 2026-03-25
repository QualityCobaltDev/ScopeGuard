import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user-store";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return <div className="container py-10"><UserDashboard user={user} /></div>;
}
