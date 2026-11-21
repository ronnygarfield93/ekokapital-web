import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return <AdminDashboardClient admin={admin} />;
}
