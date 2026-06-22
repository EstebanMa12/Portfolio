"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInView } from "@/components/motion/fade-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils/cn";
import type { AboutContent } from "@/lib/schemas/page-content";

type BioBridgeRow = AboutContent["bioBridge"][number] & {
  tooltip?: string;
};

type BioBridgeInteractiveProps = {
  rows: BioBridgeRow[];
  fromLabel: string;
  toLabel: string;
};

export function BioBridgeInteractive({
  rows,
  fromLabel,
  toLabel,
}: Readonly<BioBridgeInteractiveProps>) {
  if (rows.length === 0) return null;

  return (
    <>
      <div className="hidden md:block">
        <FadeInView duration={0.65}>
          <div className="about-bridge-table card p-0 overflow-hidden">
            <table className="about-bridge w-full">
              <thead>
                <tr>
                  <th scope="col">{fromLabel}</th>
                  <th scope="col" className="w-16" aria-hidden="true" />
                  <th scope="col">{toLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <BridgeRowDesktop
                    key={`${row.from}-${row.to}`}
                    row={row}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </FadeInView>
      </div>

      <div className="md:hidden space-y-3">
        {rows.map((row, index) => (
          <BridgeRowMobile
            key={`${row.from}-${row.to}-mobile`}
            row={row}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

function BridgeRowDesktop({
  row,
  index,
}: {
  row: BioBridgeRow;
  index: number;
}) {
  const [active, setActive] = useState(false);
  const tooltipId = useId();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.tr
      className={cn("about-bridge-row", active && "is-active")}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      aria-describedby={row.tooltip ? tooltipId : undefined}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <td>
        <span className="about-bridge-from">{row.from}</span>
      </td>
      <td className="about-bridge-arrow-cell" aria-hidden="true">
        <BridgeConnector active={active} />
      </td>
      <td>
        <span className="about-bridge-to">{row.to}</span>
        <AnimatePresence>
          {active && row.tooltip ? (
            <motion.p
              id={tooltipId}
              role="tooltip"
              className="about-bridge-tooltip"
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            >
              {row.tooltip}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}

function BridgeConnector({ active }: { active: boolean }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="about-bridge-connector">
      <svg viewBox="0 0 48 24" className="w-12 h-6" fill="none" aria-hidden>
        <motion.path
          d="M4 12 H36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 0.5 }
              : active
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0.3, opacity: 0.35 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M36 12 L44 7 M36 12 L44 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={
            reducedMotion
              ? { opacity: 0.5 }
              : active
                ? { opacity: 1, x: 0 }
                : { opacity: 0.35, x: -2 }
          }
          transition={{ duration: 0.35 }}
        />
        <motion.circle
          cx="20"
          cy="12"
          r="2.5"
          fill="currentColor"
          animate={
            reducedMotion
              ? { opacity: 0.5 }
              : active
                ? { opacity: 1, scale: 1.2 }
                : { opacity: 0.4, scale: 1 }
          }
          transition={{ duration: 0.35 }}
        />
      </svg>
    </div>
  );
}

function BridgeRowMobile({
  row,
  index,
}: {
  row: BioBridgeRow;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <FadeInView delay={index * 0.08} duration={0.5}>
      <article
        className={cn(
          "about-bridge-mobile card py-4 px-5",
          expanded && "is-expanded",
        )}
      >
        <button
          type="button"
          className="w-full text-left"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <p className="text-sm font-medium text-accent">{row.from}</p>
          <div className="about-bridge-mobile-arrow my-2" aria-hidden="true" />
          <p className="text-sm text-text-secondary">{row.to}</p>
        </button>
        {row.tooltip ? (
          <AnimatePresence>
            {expanded ? (
              <motion.p
                className="mt-3 pt-3 border-t border-border text-xs text-text-muted leading-relaxed"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {row.tooltip}
              </motion.p>
            ) : null}
          </AnimatePresence>
        ) : null}
      </article>
    </FadeInView>
  );
}
