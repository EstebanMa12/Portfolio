"use client";

import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/fade-in-view";

type AboutStoryParagraphsProps = {
  paragraphs: string[];
};

export function AboutStoryParagraphs({
  paragraphs,
}: Readonly<AboutStoryParagraphsProps>) {
  return (
    <StaggerContainer className="space-y-5" stagger={0.12} delayChildren={0.05}>
      {paragraphs.map((paragraph, index) => (
        <StaggerItem key={index}>
          <p className="text-text-secondary text-base md:text-[17px] leading-[1.75] max-w-prose">
            {paragraph}
          </p>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
