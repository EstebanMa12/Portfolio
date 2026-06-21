const WORDS_PER_MINUTE = 200;

export function computeReadingTime(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-\[\]()!`]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
