import Link from "next/link";
import { listAdminProjects } from "@/modules/admin/queries";

const STATUS_LABEL: Record<string, string> = {
  available: "متاح",
  coming_soon: "قريباً",
  sold: "مباع",
  under_construction: "قيد الإنشاء",
};

export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">المشاريع</h1>
      <div className="border-cream-300 overflow-x-auto rounded-md border bg-white">
        <table className="w-full text-start text-sm">
          <thead className="bg-cream-100 text-navy-600 text-xs">
            <tr>
              <th className="px-4 py-3 text-start">المشروع</th>
              <th className="px-4 py-3 text-start">الحالة</th>
              <th className="px-4 py-3 text-start">النشر</th>
              <th className="px-4 py-3 text-start">نطاق السعر</th>
              <th className="px-4 py-3 text-start">الوحدات المتبقية</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-cream-200 border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${p.slug}`}
                    className="text-gold-700 hover:underline"
                  >
                    {p.nameAr}
                  </Link>
                </td>
                <td className="px-4 py-3">{STATUS_LABEL[p.status] ?? p.status}</td>
                <td className="px-4 py-3">
                  {p.publicationStatus === "published" ? "منشور" : "غير منشور"}
                </td>
                <td className="px-4 py-3">
                  {p.priceMin ?? "—"}{" "}
                  {p.priceMax && p.priceMax !== p.priceMin ? `- ${p.priceMax}` : ""}
                </td>
                <td className="px-4 py-3">
                  {p.unitsRemaining ?? "—"} / {p.unitsCount ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
