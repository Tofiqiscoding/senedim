export type Role = "hr" | "worker";
export type Badge = "requests" | "document" | "notices";
export type NavItem = { label: string; href: string; badge?: Badge };
export type NavGroup = { id: string; label: string; icon: string; items: NavItem[] };

// Parent groups → child screens. HR and Worker get completely different menus.
export const nav: Record<Role, NavGroup[]> = {
  hr: [
    { id: "overview", label: "Overview", icon: "dashboard", items: [{ label: "Dashboard", href: "/hr" }] },
    {
      id: "people", label: "People", icon: "users",
      items: [
        { label: "Workers", href: "/hr/workers" },
        { label: "Onboarding", href: "/hr/onboarding" },
      ],
    },
    { id: "requests", label: "Requests", icon: "calendar", items: [{ label: "Requests", href: "/hr/requests", badge: "requests" }] },
    {
      id: "documents", label: "Documents", icon: "file",
      items: [
        { label: "Contract generator", href: "/hr/contracts" },
        { label: "Document history", href: "/hr/documents" },
      ],
    },
    { id: "auto", label: "Automation", icon: "bolt", items: [{ label: "Automation", href: "/hr/automation" }] },
    { id: "ai", label: "AI", icon: "chat", items: [{ label: "HR insights", href: "/hr/assistant" }] },
    {
      id: "account", label: "Account", icon: "bell",
      items: [
        { label: "Notifications", href: "/hr/notifications", badge: "notices" },
        { label: "Settings", href: "/hr/settings" },
      ],
    },
  ],
  worker: [
    { id: "overview", label: "Overview", icon: "dashboard", items: [{ label: "Dashboard", href: "/worker" }] },
    { id: "requests", label: "Requests", icon: "calendar", items: [{ label: "Requests", href: "/worker/requests" }] },
    { id: "documents", label: "Documents", icon: "file", items: [{ label: "My documents", href: "/worker/documents", badge: "document" }] },
    { id: "ai", label: "AI", icon: "chat", items: [{ label: "HR assistant", href: "/worker/assistant" }] },
    {
      id: "account", label: "Account", icon: "user",
      items: [
        { label: "My profile", href: "/worker/profile" },
        { label: "Notifications", href: "/worker/notifications", badge: "notices" },
      ],
    },
  ],
};

export function titleFor(role: Role, pathname: string) {
  for (const g of nav[role]) {
    const item = g.items.find((i) => i.href === pathname);
    if (item) return { group: g.label, label: item.label };
  }
  if (pathname.startsWith("/hr/workers")) return { group: "People", label: pathname.endsWith("/new") ? "Add worker" : "Worker" };
  return { group: "", label: "Dashboard" };
}
