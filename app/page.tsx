import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: seoSettings } = await supabase
    .from("seo_settings")
    .select("site_name")
    .single();

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="mb-2 text-sm uppercase tracking-widest text-zinc-400">
        Epic 1
      </p>
      <h1 className="text-3xl font-semibold">Foundation OK</h1>
      <p className="mt-4 max-w-md text-center text-zinc-400">
        {seoSettings?.site_name ?? "Portfolio"} conectado a Supabase.
        {projectCount !== null && ` ${projectCount} proyectos publicados en seed.`}
      </p>
    </main>
  );
}
