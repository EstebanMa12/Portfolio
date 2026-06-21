"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { SOCIAL_LINKS } from "@/lib/config/site";
import { Button } from "./button";
import { CloseIcon, MenuIcon } from "./icons";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusables = Array.from(
      menu.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    focusables[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeMenu]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg border border-border text-text-primary"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? tA11y("closeMenu") : tA11y("openMenu")}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 top-16 z-40 bg-bg/75 backdrop-blur-sm"
            aria-label={tA11y("closeMenu")}
            onClick={closeMenu}
          />
          <nav
            id={menuId}
            ref={menuRef}
            aria-label={tA11y("mobileMenu")}
            className="md:hidden absolute inset-x-0 top-16 z-50 border-t border-border bg-bg/98 backdrop-blur-md px-gutter py-4 shadow-[0_24px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
          >
            <NavLinks
              className="flex-col gap-1"
              linkClassName="block py-3 px-2 text-base"
              onNavigate={closeMenu}
            />
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-border">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary text-sm font-medium"
                onClick={closeMenu}
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary text-sm font-medium"
                onClick={closeMenu}
              >
                LinkedIn
              </a>
            </div>
            <div className="mt-4">
              <Button
                href="/contact"
                className="w-full text-sm px-5"
                onClick={closeMenu}
              >
                {t("contactCta")}
              </Button>
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
}
