/** Primary navigation, in the order drawn on the artboards (start → end in RTL). */
export const PRIMARY_NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن رُصافة" },
  { href: "/projects", label: "المشاريع", menu: true },
] as const;

export const SECONDARY_NAV = [
  { href: "/blog", label: "المدونات" },
  { href: "/contact", label: "تواصل معنا", emphasis: true },
] as const;

export const FOOTER_QUICK_LINKS = [
  { href: "/about", label: "عن رصـافـة" },
  { href: "/about#partners", label: "شركاء رُصافة" },
  { href: "/projects", label: "مشاريعنا" },
  { href: "/blog", label: "المدونات" },
  { href: "/contact", label: "تواصل معنا" },
] as const;
