import { getLocale } from "next-intl/server";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { SideDock } from "@/components/public/side-dock";
import { SkipLink } from "@/components/public/skip-link";
import { AmbientBackground } from "@/components/motion/ambient-background";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SOCIAL_LINKS } from "@/lib/config/site";
import { getHeroContent } from "@/lib/cache/public-queries";
import { getSettings } from "@/lib/repositories/seo-repo";
import type { Locale } from "@/lib/i18n/config";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const [settings, hero] = await Promise.all([
    getSettings(locale),
    getHeroContent(locale),
  ]);

  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <SkipLink />
      <SideDock
        cvUrl={hero?.cvUrl}
        github={hero?.socialLinks.github ?? SOCIAL_LINKS.github}
        linkedin={hero?.socialLinks.linkedin ?? SOCIAL_LINKS.linkedin}
      />
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
