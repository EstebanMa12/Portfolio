export const SITE_NAME = "Esteban Maya";

export const PRIMARY_NAV = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/about" },
  { label: "Experiencia", href: "/experience" },
  { label: "Proyectos", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contact" },
] as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/estebanmaya",
  linkedin: "https://linkedin.com/in/estebanmaya",
  email: "mailto:esteban.maya@email.com",
} as const;

export const PLACEHOLDER_PAGES = {
  "/": { title: "Inicio", description: "Portafolio profesional de Esteban Maya — Software Engineer." },
  "/about": { title: "Sobre mí", description: "Conoce mi trayectoria, formación en Bioingeniería y enfoque en sistemas." },
  "/experience": { title: "Experiencia", description: "Timeline profesional, roles y tecnologías." },
  "/projects": { title: "Proyectos", description: "Case studies de backend, sistemas distribuidos e infraestructura." },
  "/blog": { title: "Blog", description: "The Lab — notas técnicas sobre arquitectura, sistemas y DevOps." },
  "/contact": { title: "Contacto", description: "Ponte en contacto para oportunidades profesionales." },
} as const;
