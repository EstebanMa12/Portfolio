export const SITE_NAME = "Esteban Maya";

export const PRIMARY_NAV = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "experience", href: "/experience" },
  { key: "projects", href: "/projects" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof PRIMARY_NAV)[number]["key"];

export const SOCIAL_LINKS = {
  github: "https://github.com/EstebanMa12",
  linkedin: "https://www.linkedin.com/in/estebanmaya-bioengineer",
  email: "mailto:daesmapo@gmail.com",
} as const;
