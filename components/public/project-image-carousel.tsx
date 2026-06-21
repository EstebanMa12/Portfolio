"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export type ProjectCarouselImage = {
  url: string;
  alt: string;
};

type ProjectImageCarouselProps = {
  images: ProjectCarouselImage[];
  title: string;
  className?: string;
};

function getPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(getPrefersReducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function ProjectImageCarousel({
  images,
  title,
  className,
}: ProjectImageCarouselProps) {
  const t = useTranslations("projects");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    if (slides.length === 0) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(slideCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length < 2) return;

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => track.removeEventListener("scroll", updateActiveIndex);
  }, [images.length, updateActiveIndex]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const slide = track.querySelector<HTMLElement>(
        `[data-slide-index="${index}"]`,
      );
      if (!slide) return;

      slide.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveIndex(index);
    },
    [prefersReducedMotion],
  );

  if (images.length === 0) return null;

  if (images.length === 1) {
    const image = images[0]!;
    return (
      <div className={cn("project-carousel-static mb-4", className)}>
        <Image
          src={image.url}
          alt={image.alt || title}
          width={1280}
          height={720}
          className="project-carousel-image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("project-carousel mb-4", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className="project-carousel-viewport">
        <button
          type="button"
          className="project-carousel-nav project-carousel-nav-prev"
          onClick={() =>
            scrollToIndex((activeIndex - 1 + images.length) % images.length)
          }
          aria-label={t("carouselPrev")}
        >
          ‹
        </button>

        <div
          ref={trackRef}
          className="project-carousel-track"
          tabIndex={0}
        >
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              data-slide
              data-slide-index={index}
              className="project-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={t("carouselSlideOf", {
                current: index + 1,
                total: images.length,
              })}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} — ${index + 1}`}
                width={1280}
                height={720}
                className="project-carousel-image"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="project-carousel-nav project-carousel-nav-next"
          onClick={() => scrollToIndex((activeIndex + 1) % images.length)}
          aria-label={t("carouselNext")}
        >
          ›
        </button>
      </div>

      <div className="project-carousel-dots" role="tablist" aria-label={title}>
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            className={cn(
              "project-carousel-dot",
              index === activeIndex && "project-carousel-dot-active",
            )}
            aria-selected={index === activeIndex}
            aria-label={t("carouselSlideOf", {
              current: index + 1,
              total: images.length,
            })}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
