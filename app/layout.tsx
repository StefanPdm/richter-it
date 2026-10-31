import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FarbweltWaehler } from "@/components/farbwelt/farbwelt-waehler";
import { FRUEH_SKRIPT, STANDARD_WELT, WAEHLER_AKTIV } from "@/lib/farbwelt";
import { site } from "@/lib/site";
import "./globals.css";

/* next/font lädt die Schriften beim Build und liefert sie selbst aus.
   Archivo mit Breitenachse für die schmalen, hohen Überschriften. */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-src",
  display: "swap",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-src",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | IT-Infrastruktur mit Open Source`, template: `%s | ${site.name}` },
  description: site.beschreibung,
};

export const viewport: Viewport = {
  themeColor: "#0c0a08", // pruefen:erlaubt (= --color-bg Bernstein, Metadaten brauchen den Wert)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.sprache}
      data-welt={STANDARD_WELT}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      {WAEHLER_AKTIV && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: FRUEH_SKRIPT }} />
        </head>
      )}
      <body className="flex min-h-dvh flex-col">
        <div className="scroll-fortschritt" aria-hidden="true" />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-bg focus:px-4 focus:py-3"
        >
          Zum Inhalt
        </a>
        <Header />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <Footer />
        {WAEHLER_AKTIV && <FarbweltWaehler />}
      </body>
    </html>
  );
}
