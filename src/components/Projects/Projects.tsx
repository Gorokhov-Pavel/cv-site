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
  const debouncedAfterResize = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const SNAP = "snapProjects";
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 719px)");

    function clearSnap() {
      snapEngagedRef.current = false;
      root.classList.remove(SNAP);
    }

    function updateSnapHandleResize(e?: {type: string}) {
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
      const inProjectsSection = sectionRect.bottom >= vh && sectionRect.top <= 0;

      if (!inProjectsSection || zoomed) {
        clearSnap();
        return;
      }

      root.classList.add(SNAP);

      if (mq.matches && !isZoomed && e?.type !== 'scroll') {
        const section = sectionRef.current;
        if (section) {
          debouncedAfterResize.current = setTimeout(() => {
            const itemHeight = window.innerHeight; 
            const section = sectionRef.current;
            const sectionRect = section?.getBoundingClientRect();
            const inProjectsSection = sectionRect && sectionRect.bottom >= itemHeight && sectionRect.top <= 0;
            inProjectsSection && document.querySelector('.entered')?.scrollIntoView({block: 'start', behavior: 'smooth'});
          }, 300);
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        updateSnapHandleResize();
      } else if (e.touches.length === 1) {
        updateSnapHandleResize({type: 'touchmove'});
      }
    };

    updateSnapHandleResize();
    window.addEventListener("scroll", updateSnapHandleResize, { passive: true });
    window.addEventListener("resize", updateSnapHandleResize);
    window.visualViewport?.addEventListener("resize", updateSnapHandleResize);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    mq.addEventListener("change", updateSnapHandleResize);

    return () => {
      window.removeEventListener("scroll", updateSnapHandleResize);
      window.removeEventListener("resize", updateSnapHandleResize);
      window.visualViewport?.removeEventListener("resize", updateSnapHandleResize);
      window.removeEventListener("touchmove", handleTouchMove);
      mq.removeEventListener("change", updateSnapHandleResize);
      clearSnap();
    };
  }, [isZoomed]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (window.matchMedia("(max-width: 719px)").matches) {
          if (entry.isIntersecting) {
            entry.target.classList.add('entered');
          } else {
            entry.target.classList.remove('entered');
          }
        }
      });
    }, {
      threshold: 0.4
    });

    const items = document.querySelectorAll('.' + styles.projectsGrid + ' article');
    items.forEach((item) => observer.observe(item));

  }, [])

  return (
    <section
      ref={sectionRef}
      className={clsx('section', styles.sectionProjects)}
      aria-labelledby="projects-title"
    >
      <div className={styles.sectionHeader}>
        <h2 id="projects-title">{projectsHead.title}</h2>
        {projectsHead.descriptions.map((d) => (
          <p className="muted" key={d.text}>
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
                      key={i}
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
