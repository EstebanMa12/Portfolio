/** Page-local texture — grid + noise only; orbs come from global AmbientBackground. */
export function AboutPageAmbience() {
  return (
    <div aria-hidden className="about-page-ambience pointer-events-none">
      <div className="about-page-grid about-page-grid--subtle" />
      <div className="about-page-noise" />
    </div>
  );
}
