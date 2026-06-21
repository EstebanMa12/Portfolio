export type SeoFields = {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  noindex?: boolean;
};

export type SeoSettings = {
  siteName: string;
  titleTemplate: string;
  defaultDescription: string;
  siteUrl: string;
  defaultOgImage: string | null;
  twitterHandle: string | null;
};

export type ResolvedSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: { url: string }[];
    type: "website" | "article";
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
    creator?: string;
  };
  languages?: Record<string, string>;
};
