import type { Metadata } from "next";
import {
  PlaceholderPage,
  generatePlaceholderMetadata,
} from "@/components/public/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  return generatePlaceholderMetadata("/experience");
}

export default function ExperiencePage() {
  return <PlaceholderPage path="/experience" />;
}
