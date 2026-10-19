import { notFound } from "next/navigation";
import Image from "next/image";
import { getAdminProject } from "@/modules/admin/queries";
import { ProjectPricingForm } from "@/components/admin/project-pricing-form";
import { UnitRowForm } from "@/components/admin/unit-row-form";
import { ImageUploadForm } from "@/components/admin/image-upload-form";
import { ImageDeleteButton } from "@/components/admin/image-delete-button";

const IMAGE_KIND_LABEL: Record<string, string> = { card: "بطاقة", hero: "رئيسية", gallery: "معرض" };

export default async function AdminProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAdminProject(slug);
  if (!data) notFound();
  const { project, units, images } = data;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">{project.nameAr}</h1>
        <p className="text-navy-600 text-sm">{project.slug}</p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">السعر والحالة</h2>
        <ProjectPricingForm project={project} />
      </section>

      {units.length > 0 ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold">الوحدات ({units.length})</h2>
          <div className="border-cream-300 rounded-md border bg-white">
            <div className="bg-cream-100 grid grid-cols-[1fr_1fr_1fr_8rem_8rem_auto] gap-3 px-3 py-2 text-xs font-medium">
              <span>الكود</span>
              <span>النموذج</span>
              <span>الطابق</span>
              <span>السعر</span>
              <span>الحالة</span>
              <span />
            </div>
            {units.map((unit) => (
              <UnitRowForm key={unit.id} unit={unit} slug={project.slug} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-xl font-semibold">الصور ({images.length})</h2>
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border-cream-300 relative overflow-hidden rounded-md border"
            >
              <div className="relative aspect-square">
                <Image src={img.path} alt={img.altAr} fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex items-center justify-between bg-white px-2 py-1 text-xs">
                <span>{IMAGE_KIND_LABEL[img.kind] ?? img.kind}</span>
                <ImageDeleteButton imageId={img.id} slug={project.slug} />
              </div>
            </div>
          ))}
        </div>
        <ImageUploadForm projectId={project.id} slug={project.slug} />
      </section>
    </div>
  );
}
