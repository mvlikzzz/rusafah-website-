import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">نظرة عامة</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/settings"
          className="border-cream-300 hover:border-gold-500 block rounded-md border bg-white p-6"
        >
          <h2 className="font-medium">إعدادات الموقع</h2>
          <p className="text-navy-600 mt-1 text-sm">
            بيانات التواصل، الأرقام الرئيسية، وروابط التواصل الاجتماعي.
          </p>
        </Link>
        <Link
          href="/admin/projects"
          className="border-cream-300 hover:border-gold-500 block rounded-md border bg-white p-6"
        >
          <h2 className="font-medium">المشاريع</h2>
          <p className="text-navy-600 mt-1 text-sm">
            الأسعار، الوحدات المتاحة، نسبة الإنجاز، وصور كل مشروع.
          </p>
        </Link>
      </div>
    </div>
  );
}
