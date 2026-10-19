import "server-only";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { getAdminSession, type AdminSessionData } from "@/lib/session";

/** Every admin page and server action calls this first; the session cookie is
 * the only source of truth — there is no client-side gate that matters. */
export async function requireAdmin(): Promise<Required<AdminSessionData>> {
  const session = await getAdminSession();
  if (!session.userId || !session.email || !session.role) redirect("/admin/login");
  return {
    userId: session.userId,
    email: session.email,
    name: session.name ?? session.email,
    role: session.role,
  };
}

export async function listAdminProjects() {
  return db
    .select({
      id: schema.projects.id,
      slug: schema.projects.slug,
      nameAr: schema.projects.nameAr,
      status: schema.projects.status,
      publicationStatus: schema.projects.publicationStatus,
      priceMin: schema.projects.priceMin,
      priceMax: schema.projects.priceMax,
      unitsCount: schema.projects.unitsCount,
      unitsRemaining: schema.projects.unitsRemaining,
    })
    .from(schema.projects)
    .orderBy(asc(schema.projects.sort));
}

export async function getAdminProject(slug: string) {
  const [project] = await db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.slug, slug))
    .limit(1);
  if (!project) return null;
  const [units, images] = await Promise.all([
    db
      .select()
      .from(schema.projectUnits)
      .where(eq(schema.projectUnits.projectId, project.id))
      .orderBy(asc(schema.projectUnits.sort)),
    db
      .select()
      .from(schema.projectImages)
      .where(eq(schema.projectImages.projectId, project.id))
      .orderBy(asc(schema.projectImages.sort)),
  ]);
  return { project, units, images };
}

export async function getSiteSettingsForEdit() {
  const [settings] = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, "default"))
    .limit(1);
  const stats = await db.select().from(schema.companyStats).orderBy(asc(schema.companyStats.sort));
  return { settings, stats };
}
