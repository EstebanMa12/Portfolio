import { cachedQuery, unwrapOptional } from "@/lib/repositories/base";
import { mapTechnology } from "@/lib/repositories/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Technology, TechnologyInsert } from "@/lib/schemas/technology";
import { technologySchema } from "@/lib/schemas/technology";

const SELECT = "*";

async function fetchAll(): Promise<Technology[]> {
  const supabase = await createClient();
  const rows = unwrapOptional(
    await supabase.from("technologies").select(SELECT).order("name"),
  );

  return (rows ?? []).map(mapTechnology);
}

async function fetchById(id: string): Promise<Technology | null> {
  const supabase = await createClient();
  const row = unwrapOptional(
    await supabase.from("technologies").select(SELECT).eq("id", id).maybeSingle(),
  );

  if (!row) return null;
  return technologySchema.parse(mapTechnology(row));
}

async function fetchBySlug(slug: string): Promise<Technology | null> {
  const supabase = await createClient();
  const row = unwrapOptional(
    await supabase.from("technologies").select(SELECT).eq("slug", slug).maybeSingle(),
  );

  if (!row) return null;
  return technologySchema.parse(mapTechnology(row));
}

export const getAll = cachedQuery(fetchAll);

export async function getById(id: string): Promise<Technology | null> {
  return fetchById(id);
}

export async function getBySlug(slug: string): Promise<Technology | null> {
  return fetchBySlug(slug);
}

export async function create(input: TechnologyInsert): Promise<Technology> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies")
    .insert({
      name: input.name,
      slug: input.slug,
      category: input.category,
      icon_url: input.iconUrl ?? null,
    })
    .select(SELECT)
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to create technology");
  }

  return technologySchema.parse(mapTechnology(data));
}

export async function update(
  id: string,
  input: Partial<TechnologyInsert>,
): Promise<Technology> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.iconUrl !== undefined ? { icon_url: input.iconUrl } : {}),
    })
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to update technology");
  }

  return technologySchema.parse(mapTechnology(data));
}

export async function remove(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("technologies").delete().eq("id", id);
  if (error) throw error;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("technologies").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query.maybeSingle();
  return data !== null;
}
