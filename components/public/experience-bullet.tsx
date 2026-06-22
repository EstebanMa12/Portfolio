import { splitBulletMetrics } from "@/lib/utils/experience-timeline";

type ExperienceBulletProps = {
  text: string;
};

export function ExperienceBullet({ text }: Readonly<ExperienceBulletProps>) {
  const parts = splitBulletMetrics(text);

  return (
    <span>
      {parts.map((part, partIndex) =>
        part.metric ? (
          <span
            key={`${partIndex}-${part.text}`}
            className="font-medium text-metric-teal"
          >
            {part.text}
          </span>
        ) : (
          <span key={`${partIndex}-${part.text}`}>{part.text}</span>
        ),
      )}
    </span>
  );
}
