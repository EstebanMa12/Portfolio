import { z } from "zod";
import { locales } from "@/lib/i18n/config";

export const localeSchema = z.enum(locales);
