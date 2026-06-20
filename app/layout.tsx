import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { resolvePageMeta, toMetadata } from "@/lib/domain/seo/seo-service";
import { getSettings } from "@/lib/repositories/seo-repo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(settings.siteUrl),
    ...toMetadata(resolvePageMeta(settings, {}, "/")),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark h-full antialiased ${inter.variable} ${GeistSans.variable}`}
    >
      <body
        className={`${GeistSans.className} min-h-full flex flex-col bg-bg text-text-primary overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
