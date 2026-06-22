import type { Technology } from "@/lib/schemas/technology";

export type ExperienceTimelineItem = {
  id: string;
  company: string;
  role: string;
  startYear: number;
  periodLabel: string;
  periodDatetime: string;
  durationLabel: string;
  bullets: string[];
  technologies: Technology[];
  isCurrent: boolean;
  moreTechnologiesLabel: string;
};

export type ExperienceTimelineSummary = {
  spanYears: number;
  roleCount: number;
  techCount: number;
};

export type ExperienceTimelineLabels = {
  present: string;
  currentRole: string;
  stack: string;
  summaryLabel: string;
  yearsInIndustry: string;
  roles: string;
  technologiesUsed: string;
  timelineLabel: string;
  roleNavLabel: string;
  expandRole: string;
  collapseRole: string;
  showLessTech: string;
};
