import type { Metadata } from "next";
import { site } from "./site";

type SeitenAngaben = {
  /** höchstens 60 Zeichen. Auf Unterseiten hängt layout.tsx " | Firmenname" an,
      auf der Startseite nicht: dort den Namen selbst in den Titel schreiben. */
  titel: string;
  /** höchstens 155 Zeichen */
  beschreibung: string;
  /** Pfad mit führendem Schrägstrich, z. B. "/leistungen/reinigung" */
  pfad: string;
  /** Pfad zum OG-Bild in /public, 1200x630 */
  bild?: string;
};

/** Metadaten je Seite: Title, Description, Canonical, OpenGraph, Twitter. */
export function seitenMetadaten({ titel, beschreibung, pfad, bild = "/og.jpg" }: SeitenAngaben): Metadata {
  const url = `${site.url}${pfad}`;
  return {
    title: titel,
    description: beschreibung,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: titel,
      description: beschreibung,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: bild, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: titel, description: beschreibung, images: [bild] },
  };
}
