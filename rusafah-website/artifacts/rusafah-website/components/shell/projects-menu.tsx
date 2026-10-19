"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  href: string;
  className?: string;
  onDark: boolean;
  projects: { slug: string; nameEn: string; nameAr: string }[];
};

/** "المشاريع ▾" — a keyboard-accessible menu listing catalogue entry points and featured projects. */
export function ProjectsMenu({ label, href, className, onDark, projects }: Props) {
  return (
    <DropdownMenu.Root modal={false} dir="rtl">
      <DropdownMenu.Trigger
        className={cn("inline-flex items-center gap-2", className)}
        aria-label={`${label}، افتح القائمة`}
      >
        <span>{label}</span>
        <ChevronDown
          className="size-4 transition-transform data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={12}
          align="start"
          className={cn(
            "shadow-glow z-50 min-w-64 rounded-md border p-2 backdrop-blur-xl",
            onDark
              ? "border-cream-200/15 bg-navy-900/95 text-cream-100"
              : "border-gold-600/20 bg-cream-100 text-navy-900",
          )}
        >
          <MenuLink href={href}>كل المشاريع</MenuLink>
          <MenuLink href="/projects/latest">أحدث المشاريع</MenuLink>
          {projects.length ? (
            <DropdownMenu.Separator className="my-2 h-px bg-current opacity-15" />
          ) : null}
          {projects.map((p) => (
            <MenuLink key={p.slug} href={`/projects/${p.slug}`}>
              <span className="font-latin">{p.nameEn}</span>
              <span className="ms-2 opacity-70">{p.nameAr}</span>
            </MenuLink>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={href}
        className="hover:bg-gold-600/15 focus:bg-gold-600/15 data-[highlighted]:bg-gold-600/15 block rounded-sm px-4 py-2.5 text-base outline-none"
      >
        {children}
      </Link>
    </DropdownMenu.Item>
  );
}
