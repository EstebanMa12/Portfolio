import type { Metadata } from "next";
import {
  PlaceholderPage,
  generatePlaceholderMetadata,
} from "@/components/public/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  return generatePlaceholderMetadata("/about");
}

export default function AboutPage() {
  return <PlaceholderPage path="/about" />;
}
