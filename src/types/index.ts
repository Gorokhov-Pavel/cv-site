export type LightboxState =
  | { isOpen: false }
  | { isOpen: true; src: string; alt: string; title: string };

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  isDesktop?: boolean;
};

export type Project = {
  title: string;
  description: string;
  team?: string;
  outro?: string;
  stack: string[];
  links?: ProjectLink[];
  screenshots: ProjectScreenshot[];
};

export type MobileSlideContent = {
  showTitle: boolean;
  showLinks: boolean;
  showDescription: boolean;
  showTeam: boolean;
  showStack: boolean;
  showOutro: boolean;
  outroText?: string;
};

export type ProjectsHead = {
  title: string;
  descriptions: {
    text: string;
    insideLinks: { label: string; href: string }[];
  }[];
};

export type CvPageHead = {
  avatar: { src: string; alt: string };
  name: string;
  role: string;
  summary: string;
  githubButton: { href: string; label: string };
  downloadCVButton: { href: string; label: string };
};

export type Skills = {
  title: string;
  list: string[];
};

export type Theme = "light" | "dark";
