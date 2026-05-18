import { useEffect, useRef, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import { projects, projectsHead } from "../../data";
import styles from "./Projects.module.css";
import clsx from "clsx";

const SNAP_CLASS = "snapProjects";
const ZOOMED_CLASS = "zoomed";
const MOBILE_BREAKPOINT = 719;

export function Projects({
  openLightbox,
}: {
  openLightbox: (src: string, alt: string, title: string) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstProjectSlideRef = useRef<HTMLElement>(null);
  const snapEngagedRef = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const root = document.documentElement;
      const viewport = window.visualViewport;

    function clearSnap() {
      snapEngagedRef.current = false;
      root.classList.remove(SNAP_CLASS);
    }

    function updateSnapHandleResize(e?: {type: string}) {
      if (!mq.matches) {
        clearSnap();
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const vh = window.innerHeight;
      const zoomed = viewport ? viewport.scale > 1.05 : false;
      setIsZoomed((current) => (current === zoomed ? current : zoomed));

      if (zoomed) {
        root.classList.add(ZOOMED_CLASS);
          } else {
        root.classList.remove(ZOOMED_CLASS);
          }

      const sectionRect = section.getBoundingClientRect();
      const inProjectsSection = sectionRect.bottom >= vh && sectionRect.top <= 0;

      if (!inProjectsSection || zoomed) {
        clearSnap();
        return;
      }

      root.classList.add(SNAP_CLASS);

      if (mq.matches && !isZoomed && e?.type !== 'scroll') {
        const section = sectionRef.current;
        if (section) {
          resizeTimeoutRef.current = setTimeout(() => {
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
        if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
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
      className={clsx("section", styles.sectionProjects)}
      aria-labelledby="projects-title"
    >
      <div className={styles.sectionHeader}>
        <h2 id="projects-title">{projectsHead.title}</h2>
        {projectsHead.descriptions.map((description, index) => (
          <p className="muted" key={index}>
            {description.text
              .split(
                new RegExp(
                  `(${description.insideLinks.map((link) => link.label).join("|")})`,
                  "g",
                ),
              )
              .map((segment, segmentIndex) => {
                if (segmentIndex % 2 === 0) {
                  return segment;
                }

                const matchedLink = description.insideLinks.find(
                  (link) => link.label === segment,
                );

                return matchedLink ? (
                  <a
                    className={styles.link}
                    href={matchedLink.href}
                    key={segmentIndex}
                  >
                    {segment}
                  </a>
                ) : null;
              })}
          </p>
        ))}
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            onOpenLightbox={openLightbox}
            firstSlideRef={index === 0 ? firstProjectSlideRef : undefined}
            isZoomed={isZoomed}
          />
        ))}
      </div>
    </section>
  );
}
