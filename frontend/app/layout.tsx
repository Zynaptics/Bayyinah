import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Martian_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import TopNav from "@/components/TopNav";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const urdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-urdu", display: "swap" });

export const metadata: Metadata = {
  title: "Bayyinah: media authenticity checks",
  description: "Check images, text, audio and video for signs of AI generation or misinformation, with the evidence shown.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Applies a saved theme before first paint so the page does not flash.
const themeScript = `try{var t=localStorage.getItem("bayyinah-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${ui.variable} ${mono.variable} ${urdu.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <TopNav />
        <div className="content">{children}</div>
        <footer className="foot">Scores support human judgment. They are not proof of authenticity or of fakery.</footer>
      </body>
    </html>
  );
}
