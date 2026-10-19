import Link from "next/link";
import { Search } from "lucide-react";
import { RusafahLogo } from "@/components/patterns/rusafah-logo";
import { listFeaturedProjects } from "@/modules/projects/queries";
import { getSiteSettings } from "@/modules/site/queries";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav-links";
import { ProjectsMenu } from "./projects-menu";
import { MenuDrawer } from "./menu-drawer";

type Props = {
  /** overlay: light text over imagery (absolute). light: navy/gold text on cream pages (static). */
  variant?: "overlay" | "light" | "dark";
  current?: string;
};

export async function SiteHeader({ variant = "overlay", current }: Props) {
  const [featured, settings] = await Promise.all([listFeaturedProjects(), getSiteSettings()]);
  const onDark = variant !== "light";
  const text = onDark ? "text-cream-100" : "text-gold-600";
  const linkBase = cn(
    "relative inline-flex min-h-6 items-center py-2 text-[17px] transition-colors hover:opacity-100",
    text,
    onDark ? "opacity-90" : "",
  );
  const activeClass = onDark ? "text-gold-400 opacity-100" : "text-gold-700";

  return (
    <header
      className={cn(
        "z-40 w-full",
        variant === "overlay"
          ? "absolute inset-x-0 top-0"
          : variant === "dark"
            ? "bg-navy-900"
            : "bg-transparent",
      )}
    >
      <nav
        aria-label="التنقل الرئيسي"
        className="container-wide flex h-20 items-center justify-between gap-4 pt-[env(safe-area-inset-top)] md:h-24 md:gap-6"
      >
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={cn("shrink-0", text)}
            aria-label={`${settings.companyNameAr} — الصفحة الرئيسية`}
          >
            <RusafahLogo className="h-12 w-auto md:h-14" />
          </Link>
          <ul className="hidden items-center gap-9 lg:flex">
            {PRIMARY_NAV.map((item) =>
              "menu" in item && item.menu ? (
                <li key={item.href}>
                  <ProjectsMenu
                    label={item.label}
                    href={item.href}
                    className={cn(linkBase, current?.startsWith("/projects") && activeClass)}
                    projects={featured.map((p) => ({
                      slug: p.slug,
                      nameEn: p.nameEn,
                      nameAr: p.nameAr,
                    }))}
                    onDark={onDark}
                  />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current === item.href ? "page" : undefined}
                    className={cn(linkBase, current === item.href && activeClass)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-7">
          <ul className="hidden items-center gap-8 lg:flex">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                  className={cn(
                    linkBase,
                    "emphasis" in item && item.emphasis && "font-bold",
                    current === item.href && activeClass,
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/search"
            className={cn(
              "hidden size-9 items-center justify-center rounded-full lg:inline-flex",
              text,
            )}
            aria-label="البحث في الموقع"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <MenuDrawer
            onDark={onDark}
            phone={settings.unifiedNumber}
            whatsapp={settings.whatsappNumber}
            email={settings.email}
            projects={featured.map((p) => ({ slug: p.slug, nameEn: p.nameEn, nameAr: p.nameAr }))}
          />
        </div>
      </nav>
    </header>
  );
}
