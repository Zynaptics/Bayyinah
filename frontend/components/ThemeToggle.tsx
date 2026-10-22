"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setDark(t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("bayyinah-theme", next); } catch { /* storage unavailable */ }
    setDark(!dark);
  }

  return (
    <button type="button" className="theme" onClick={toggle}
            aria-label={dark ? "Switch to the light Ice theme" : "Switch to the dark Night theme"}>
      {dark === null ? "Theme" : dark ? "Ice mode" : "Night mode"}
    </button>
  );
}
