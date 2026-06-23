import { ArticleForm } from "@/components/admin/article-form";
import { SectionLabel } from "@/components/public/section-label";

export default function NewArticlePage() {
  return (
    <>
      <SectionLabel className="mb-3">CMS</SectionLabel>
      <h1 className="font-display text-3xl font-semibold text-text-primary mb-8">
        Nuevo artículo
      </h1>
      <ArticleForm />
    </>
  );
}
