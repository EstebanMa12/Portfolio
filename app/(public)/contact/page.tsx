import type { Metadata } from "next";
import {
  PlaceholderPage,
  generatePlaceholderMetadata,
} from "@/components/public/placeholder-page";

export async function generateMetadata(): Promise<Metadata> {
  return generatePlaceholderMetadata("/contact");
}

export default function ContactPage() {
  return <PlaceholderPage path="/contact" />;
}
