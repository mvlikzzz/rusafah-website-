import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="bg-navy-900 flex min-h-dvh items-center justify-center px-4">
      <div className="bg-cream-100 w-full max-w-sm rounded-md p-8 shadow-xl">
        <h1 className="text-navy-900 mb-1 text-xl font-semibold">لوحة تحكم رُصافة</h1>
        <p className="text-navy-600 mb-6 text-sm">سجّل الدخول لإدارة محتوى الموقع.</p>
        <LoginForm />
      </div>
    </main>
  );
}
