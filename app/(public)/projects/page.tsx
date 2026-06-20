import type { Metadata } from "next";
import {
  PlaceholderPage,
  generatePlaceholderMetadata,
} from "@/components/public/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  return generatePlaceholderMetadata("/projects");
}

export default function ProjectsPage() {
  return <PlaceholderPage path="/projects" />;
}
