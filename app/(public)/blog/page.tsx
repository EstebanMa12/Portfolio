import type { Metadata } from "next";
import {
  PlaceholderPage,
  generatePlaceholderMetadata,
} from "@/components/public/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  return generatePlaceholderMetadata("/blog");
}

export default function BlogPage() {
  return <PlaceholderPage path="/blog" />;
}
