import { getSiteSettingsForEdit } from "@/modules/admin/queries";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { StatForm } from "@/components/admin/stat-form";

export default async function AdminSettingsPage() {
  const { settings, stats } = await getSiteSettingsForEdit();
  if (!settings) {
    return <p>تعذر تحميل إعدادات الموقع.</p>;
  }
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-4 text-2xl font-semibold">إعدادات الموقع</h1>
        <SiteSettingsForm settings={settings} />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">الأرقام الرئيسية</h2>
        <div className="space-y-3">
          {stats.map((stat) => (
            <StatForm key={stat.id} stat={stat} />
          ))}
        </div>
      </section>
    </div>
  );
}
