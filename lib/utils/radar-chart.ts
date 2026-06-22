export type RadarSkill = {
  name: string;
  level: number;
};

export const DEFAULT_RADAR_SKILLS: RadarSkill[] = [
  { name: "Frontend", level: 0.88 },
  { name: "Backend", level: 0.92 },
  { name: "Bases de datos", level: 0.78 },
  { name: "Infra / CI", level: 0.85 },
  { name: "Seguridad", level: 0.72 },
  { name: "Arquitectura", level: 0.8 },
];

const GRID_LEVELS = [1, 0.75, 0.5, 0.25];

function polarPoint(
  index: number,
  total: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function getRadarPolygonPoints(
  skills: RadarSkill[],
  cx = 200,
  cy = 200,
  maxRadius = 120,
): string {
  return skills
    .map((skill, index) => {
      const point = polarPoint(index, skills.length, maxRadius * skill.level, cx, cy);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export function getRadarGridPoints(
  level: number,
  total: number,
  cx = 200,
  cy = 200,
  maxRadius = 120,
): string {
  return Array.from({ length: total }, (_, index) => {
    const point = polarPoint(index, total, maxRadius * level, cx, cy);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function getRadarLabelPosition(
  index: number,
  total: number,
  cx = 200,
  cy = 200,
  labelRadius = 138,
): { x: number; y: number; anchor: "middle" | "start" | "end" } {
  const point = polarPoint(index, total, labelRadius, cx, cy);
  const anchor =
    point.x > cx + 8 ? "start" : point.x < cx - 8 ? "end" : "middle";

  return { x: point.x, y: point.y, anchor };
}

export function getRadarAxisEnd(
  index: number,
  total: number,
  cx = 200,
  cy = 200,
  maxRadius = 120,
): { x: number; y: number } {
  return polarPoint(index, total, maxRadius, cx, cy);
}

export function getRadarGridLevels(): number[] {
  return GRID_LEVELS;
}

export function getRadarDescription(skills: RadarSkill[]): string {
  return skills
    .map((skill) => `${skill.name} ${Math.round(skill.level * 100)}%`)
    .join(", ");
}
