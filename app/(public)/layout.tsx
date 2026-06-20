import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { SkipLink } from "@/components/public/skip-link";
import { getSettings } from "@/lib/repositories/seo-repo";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <SkipLink />
      <Header siteName={settings.siteName} />
      <main
        id="main"
        className="flex-1 max-w-6xl mx-auto w-full px-gutter pt-28 pb-section-gap-mobile md:pb-section-gap"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
