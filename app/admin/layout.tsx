import type { Metadata } from "next";
import AdminNav from "@/components/AdminNav";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav societe={settings.societe} />
      <main className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
