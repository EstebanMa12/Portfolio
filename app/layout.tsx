import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esteban Maya | Software Engineer",
  description: "Portafolio profesional — Foundation OK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        {children}
      </body>
    </html>
  );
}
