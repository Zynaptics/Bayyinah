"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/verify", label: "New check" },
  { href: "/history", label: "History" },
  { href: "/models", label: "Models" },
];

export default function TopNav() {
  const path = usePathname();
  return (
    <header className="top">
      <Link href="/" className="brand">Bayyinah <span lang="ur" className="urdu">بَيِّنَة</span></Link>
      <nav aria-label="Main" className="nav-row">
        {NAV.map((n, i) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className="nav" aria-current={active ? "page" : undefined}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span> {n.label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </header>
  );
}
