import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";
import { AdminLoginClient } from "@/components/AdminLoginClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal Internal — PT Ekokapital Sekuritas",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InternalAdminPortalPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return <AdminLoginClient />;
  }
  return <AdminDashboardClient admin={admin} />;
}
