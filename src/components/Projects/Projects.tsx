import { useEffect, useRef, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import { projects, projectsHead } from "../../data";
import styles from "./Projects.module.css";
import clsx from "clsx";

export function Projects({
  openLightbox,
}: {
  openLightbox: (src: string, alt: string, title: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstProjectSlideRef = useRef<HTMLElement>(null);
  const snapEngagedRef = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const SNAP = "snapProjects";
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 719px)");

    function clearSnap() {
      snapEngagedRef.current = false;
      root.classList.remove(SNAP);
    }

    function updateSnap() {
      if (!mq.matches) {
        clearSnap();
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const viewport = window.visualViewport;
      const zoomed = viewport ? viewport.scale > 1.05 : false;
      setIsZoomed((current) => (current === zoomed ? current : zoomed));

      if (zoomed) {
        root.classList.add("zoomed");
      } else {
        root.classList.remove("zoomed");
      }

      const sectionRect = section.getBoundingClientRect();
      //console.log('Section rect:', sectionRect)
      const inProjectsSection = sectionRect.bottom > vh && sectionRect.top < 0;

      if (!inProjectsSection || zoomed) {
        clearSnap();
        return;
      }

      root.classList.add(SNAP);
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        updateSnap();
      }
    };

    updateSnap();
    window.addEventListener("scroll", updateSnap, { passive: true });
    window.addEventListener("resize", updateSnap);
    window.visualViewport?.addEventListener("resize", updateSnap);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    mq.addEventListener("change", updateSnap);

    return () => {
      window.removeEventListener("scroll", updateSnap);
      window.removeEventListener("resize", updateSnap);
      window.visualViewport?.removeEventListener("resize", updateSnap);
      window.removeEventListener("touchmove", handleTouchMove);
      mq.removeEventListener("change", updateSnap);
      clearSnap();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={clsx('section', styles.sectionProjects)}
      aria-labelledby="projects-title"
    >
      <div className={styles.sectionHeader}>
        <h2 id="projects-title">{projectsHead.title}</h2>
        {projectsHead.descriptions.map((d) => (
          <p className="muted">
            {d.text
              .split(
                new RegExp(
                  `(${d.insideLinks.map((il) => il.label).join("|")})`,
                  "g",
                ),
              )
              .map((st, i) => {
                if (i % 2 === 0) {
                  return st;
                } else {
                  return (
                    <a
                      className={styles.link}
                      href={d.insideLinks.find((il) => il.label === st)?.href}
                    >
                      {st}
                    </a>
                  );
                }
              })}
          </p>
        ))}
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((p, i) => (
          <ProjectCard
            key={p.title}
            project={p}
            onOpenLightbox={openLightbox}
            firstSlideRef={i === 0 ? firstProjectSlideRef : undefined}
            isZoomed={isZoomed}
          />
        ))}
      </div>
    </section>
  );
}
