import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/modules/admin/queries";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/settings", label: "إعدادات الموقع" },
  { href: "/admin/projects", label: "المشاريع" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="bg-cream-50 text-navy-900 min-h-dvh" dir="rtl">
      <header className="bg-navy-900 text-cream-100 flex items-center justify-between px-6 py-4">
        <span className="font-medium">لوحة تحكم رُصافة</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-cream-100/70">{admin.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        <nav className="w-48 shrink-0 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-cream-200 block rounded-sm px-3 py-2 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
