import { cachedQuery, assertNoError, RepositoryError, unwrap } from "@/lib/repositories/base";
import { mapExperienceWithTechnologies } from "@/lib/repositories/mappers";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type {
  Experience,
  ExperienceInsert,
  ExperienceWithTechnologies,
} from "@/lib/schemas/experience";
import { experienceSchema } from "@/lib/schemas/experience";

const WITH_TECH = `
  *,
  experience_technologies (
    technologies (*)
  )
`;

async function fetchAllPublic(): Promise<ExperienceWithTechnologies[]> {
  const supabase = createStaticClient();
  const rows = unwrap(
    await supabase
      .from("experiences")
      .select(WITH_TECH)
      .order("sort_order", { ascending: true }),
  );

  return rows.map(mapExperienceWithTechnologies);
}

async function fetchAllAdmin(): Promise<ExperienceWithTechnologies[]> {
  return fetchAllPublic();
}

async function fetchById(id: string): Promise<ExperienceWithTechnologies | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select(WITH_TECH)
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  return mapExperienceWithTechnologies(data);
}

export const getAllPublic = cachedQuery(fetchAllPublic);
export const getAllAdmin = cachedQuery(fetchAllAdmin);

export async function getById(
  id: string,
  _admin = false,
): Promise<ExperienceWithTechnologies | null> {
  void _admin;
  return fetchById(id);
}

async function syncTechnologies(
  experienceId: string,
  technologyIds: string[],
): Promise<void> {
  const supabase = await createClient();

  unwrap(
    await supabase
      .from("experience_technologies")
      .delete()
      .eq("experience_id", experienceId),
  );

  if (technologyIds.length === 0) return;

  unwrap(
    await supabase.from("experience_technologies").insert(
      technologyIds.map((technologyId) => ({
        experience_id: experienceId,
        technology_id: technologyId,
      })),
    ),
  );
}

export async function create(
  input: ExperienceInsert,
): Promise<ExperienceWithTechnologies> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert({
      company: input.company,
      role: input.role,
      start_date: input.startDate,
      end_date: input.endDate ?? null,
      bullets: input.bullets,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new RepositoryError(
      error?.message ?? "Failed to create experience",
      "QUERY_FAILED",
      error,
    );
  }

  await syncTechnologies(data.id, input.technologyIds);
  const created = await fetchById(data.id);
  if (!created) {
    throw new Error("Failed to load created experience");
  }
  return created;
}

export async function update(
  id: string,
  input: Partial<ExperienceInsert>,
): Promise<ExperienceWithTechnologies> {
  const supabase = await createClient();

  if (
    input.company !== undefined ||
    input.role !== undefined ||
    input.startDate !== undefined ||
    input.endDate !== undefined ||
    input.bullets !== undefined ||
    input.sortOrder !== undefined
  ) {
    unwrap(
      await supabase
        .from("experiences")
        .update({
          ...(input.company !== undefined ? { company: input.company } : {}),
          ...(input.role !== undefined ? { role: input.role } : {}),
          ...(input.startDate !== undefined ? { start_date: input.startDate } : {}),
          ...(input.endDate !== undefined ? { end_date: input.endDate ?? null } : {}),
          ...(input.bullets !== undefined ? { bullets: input.bullets } : {}),
          ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
  }

  if (input.technologyIds !== undefined) {
    await syncTechnologies(id, input.technologyIds);
  }

  const updated = await fetchById(id);
  if (!updated) {
    throw new Error("Failed to load updated experience");
  }
  return updated;
}

export async function remove(id: string): Promise<void> {
  const supabase = await createClient();
  assertNoError(await supabase.from("experiences").delete().eq("id", id));
}

export function toExperience(entity: ExperienceWithTechnologies): Experience {
  const { technologies, ...experience } = entity;
  void technologies;
  return experienceSchema.parse(experience);
}
