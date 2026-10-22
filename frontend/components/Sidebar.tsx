"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/verify", label: "New check" },
  { href: "/history", label: "History" },
  { href: "/models", label: "Models" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="side">
      <Link href="/" className="brand">
        Bayyinah <span lang="ur" className="urdu">بَيِّنَة</span>
      </Link>
      <nav aria-label="Main">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className="nav" aria-current={active ? "page" : undefined}>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <p className="side-note">Scores support human judgment. They are not proof of authenticity or of fakery.</p>
    </aside>
  );
}
