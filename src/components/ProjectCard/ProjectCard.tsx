import { useEffect, useId, useRef, useState, type RefObject } from "react";
import styles from "./ProjectCard.module.css";
import clsx from "clsx";

export type Project = {
  title: string;
  description: string;
  team?: string;
  outro?: string;
  stack: string[];
  links?: Array<{ label: string; href: string }>;
  screenshots: Array<{ src: string; alt: string; isDesktop?: boolean }>;
};

function ProjectCard({
  project,
  onOpenLightbox,
  firstSlideRef,
  isZoomed,
}: {
  project: Project;
  onOpenLightbox: (src: string, alt: string, title: string) => void;
  firstSlideRef?: RefObject<HTMLElement | null>;
  isZoomed?: boolean;
}) {
  const labelIdMobile = useId();
  const labelIdDesktop = useId();
  const stripRef = useRef<HTMLDivElement>(null);
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [isGalleryScrollable, setIsGalleryScrollable] = useState(false);
  const isGalleryScrollableRef = useRef(false);
  const hideOverlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const parent = el.parentElement;
    const navButton = parent?.querySelector<HTMLButtonElement>(
      "." + styles.galleryNav,
    );
    const navWidth = navButton?.clientWidth ?? 52;
    const navGap = 12;

    const updateGalleryScroll = () => {
      const containerWidth = parent?.clientWidth ?? el.clientWidth;
      const availableWidth = Math.max(
        0,
        containerWidth - (navWidth * 2 + navGap),
      );
      const nextScrollable = el.scrollWidth > availableWidth + 1;
      if (nextScrollable !== isGalleryScrollableRef.current) {
        isGalleryScrollableRef.current = nextScrollable;
        setIsGalleryScrollable(nextScrollable);
      }
    };

    updateGalleryScroll();

    const resizeObserver = new ResizeObserver(updateGalleryScroll);
    resizeObserver.observe(el);
    window.addEventListener("resize", updateGalleryScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateGalleryScroll);
    };
  }, [project.screenshots.length]);

  // Split outro into sentences for distribution across slides
  const outroSentences = project.outro
    ? project.outro.split(/(?<=[.!?])\s+/).filter((s) => s.trim())
    : [];

  function scrollStrip(dir: -1 | 1) {
    const el = stripRef.current;
    if (!el) return;
    const step = Math.max(220, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function hideOverlay() {
    if (hideOverlayTimeoutRef.current) {
      clearTimeout(hideOverlayTimeoutRef.current);
    }
    setIsOverlayHidden(true);
    hideOverlayTimeoutRef.current = setTimeout(() => {
      setIsOverlayHidden(false);
    }, 5000);
  }

  useEffect(() => {
    return () => {
      if (hideOverlayTimeoutRef.current) {
        clearTimeout(hideOverlayTimeoutRef.current);
      }
    };
  }, []);

  // Helper to get content for each mobile slide
  function getMobileSlideContent(slideIndex: number, slidesLength: number) {
    if (slideIndex === 0) {
      if (slidesLength === 1) {
        return {
          showTitle: true,
          showLinks: true,
          showDescription: true,
          showTeam: true,
          showStack: true,
          showOutro: true,
        };
      }
      return {
        showTitle: true,
        showLinks: true,
        showDescription: true,
        showTeam: false,
        showStack: false,
        showOutro: false,
      };
    } else if (slideIndex === 1) {
      if (slidesLength === 2) {
        return {
          showTitle: true,
          showLinks: false,
          showDescription: false,
          showTeam: true,
          showStack: true,
          showOutro: true,
        };
      }
      return {
        showTitle: true,
        showLinks: false,
        showDescription: false,
        showTeam: true,
        showStack: true,
        showOutro: false,
      };
    } else {
      // Slides 2+: distribute outro sentences
      const outroStartIndex = slideIndex - 2;
      const isLastSlide = slideIndex === project.screenshots.length - 1;

      return {
        showTitle: true,
        showLinks: false,
        showDescription: false,
        showTeam: false,
        showStack: false,
        showOutro: true,
        outroText: isLastSlide
          ? outroSentences.slice(outroStartIndex).join(" ")
          : outroSentences[outroStartIndex] || "",
      };
    }
  }

  const [stripScrollInEnd, setStripScrollInEnd] = useState(true);

  function stripScrollFunc() {
    setStripScrollInEnd(
      (stripRef.current?.scrollLeft !== undefined &&
        stripRef.current.scrollLeft < 3) ||
        (stripRef.current?.scrollLeft !== undefined &&
          stripRef.current?.scrollWidth !== undefined &&
          stripRef.current?.clientWidth !== undefined &&
          stripRef.current.scrollWidth - stripRef.current.scrollLeft <
            stripRef.current.clientWidth + 3),
    );
  }

  useEffect(() => {
    stripRef.current?.addEventListener("scroll", stripScrollFunc);
    return () => {
      stripRef.current?.removeEventListener("scroll", stripScrollFunc);
    };
  }, []);

  return (
    <div className={styles.projectCardWrap}>
      <div className={styles.projectSlidesMobile}>
        {project.screenshots.map((s, i) => {
          const content = getMobileSlideContent(i, project.screenshots.length);

          return (
            <article
              key={`${project.title}-m-${i}`}
              ref={i === 0 ? firstSlideRef : undefined}
              className={`${styles.projectSlide} ${i === 0 ? styles.projectSlideFirst : ""} ${isZoomed ? styles.projectSlideZoomed : ""} ${s.isDesktop ? styles.projectSlideDesktopScreenshot : ""}`}
              style={{ backgroundImage: `url(${s.src})` }}
              aria-labelledby={i === 0 ? labelIdMobile : undefined}
            >
              <div className={styles.projectCardBg} aria-hidden="true" />

              <div
                className={`${styles.projectOverlay} ${isZoomed || isOverlayHidden ? styles.projectOverlayHidden : styles.projectOverlayVisible}`}
              >
                <button
                  type="button"
                  className={styles.projectOverlayClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    hideOverlay();
                  }}
                  aria-label="Закрыть текст"
                >
                  ✕
                </button>
                <header
                  className={clsx(
                    styles.projectHeader,
                    styles.projectHeaderOverlay,
                  )}
                >
                  {content.showTitle && (
                    <div className={styles.projectTitleRow}>
                      <h3
                        className={clsx(
                          styles.projectTitle,
                          styles.projectTitleOverlay,
                        )}
                        id={labelIdMobile}
                      >
                        {project.title}
                      </h3>
                      {content.showLinks && project.links?.length ? (
                        <div className={styles.projectLinks}>
                          {project.links.map((l) => (
                            <a
                              key={l.href}
                              className={clsx(
                                styles.projectLink,
                                styles.projectLinkOverlay,
                              )}
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {l.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                  {content.showDescription && (
                    <p
                      className={clsx(
                        styles.projectDescription,
                        styles.projectDescriptionOverlay,
                      )}
                    >
                      {project.description}
                    </p>
                  )}
                  {content.showTeam ? (
                    <p
                      className={clsx(
                        styles.projectTeam,
                        styles.projectDescriptionOverlay,
                      )}
                    >
                      {project.team}
                    </p>
                  ) : null}
                  {content.showOutro ? (
                    <p
                      className={clsx(
                        styles.projectDescription,
                        styles.projectDescriptionOverlay,
                      )}
                    >
                      {content.outroText}
                    </p>
                  ) : null}
                  {content.showStack && (
                    <ul
                      className={clsx(
                        styles.chips,
                        styles.chipsSm,
                        styles.chipsOverlay,
                      )}
                      aria-label="Стек"
                    >
                      {project.stack.map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                    </ul>
                  )}
                </header>
              </div>

              {i !== 0 && !content.showTeam && !content.showOutro ? (
                <>
                  <button
                    type="button"
                    className={styles.projectSlideHit}
                    aria-label={`Увеличить: ${s.alt}`}
                    onClick={() => onOpenLightbox(s.src, s.alt, project.title)}
                  />
                  <div
                    className={styles.projectSlideCaptionBar}
                    aria-hidden="true"
                  >
                    <span className={styles.projectSlideCaption}>{s.alt}</span>
                  </div>
                </>
              ) : null}
            </article>
          );
        })}
      </div>

      <article
        className={clsx(
          styles.projectCard,
          styles.projectCardHero,
          styles.projectCardDesktop,
        )}
        aria-labelledby={labelIdDesktop}
      >
        <div className={styles.projectDesktopInner}>
          <div className={styles.projectOverlay}>
            <header
              className={clsx(
                styles.projectHeader,
                styles.projectHeaderOverlay,
              )}
            >
              <div className={styles.projectTitleRow}>
                <h3
                  className={clsx(
                    styles.projectTitle,
                    styles.projectTitleOverlay,
                  )}
                  id={labelIdDesktop}
                >
                  {project.title}
                </h3>
                {project.links?.length ? (
                  <div className={styles.projectLinks}>
                    {project.links.map((l) => (
                      <a
                        key={l.href}
                        className={clsx(
                          styles.projectLink,
                          styles.projectLinkOverlay,
                        )}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              <p
                className={clsx(
                  styles.projectDescription,
                  styles.projectDescriptionOverlay,
                )}
              >
                {project.description}
              </p>
              {project.team && (
                <>
                  <p
                    className={clsx(
                      styles.projectTeam,
                      styles.projectDescriptionOverlay,
                    )}
                  >
                    {project.team}
                  </p>
                </>
              )}
              {project.outro && (
                <p
                  className={clsx(
                    styles.projectDescription,
                    styles.projectDescriptionOverlay,
                  )}
                >
                  {project.outro}
                </p>
              )}
              <ul
                className={clsx(
                  styles.chips,
                  styles.chipsSm,
                  styles.chipsOverlay,
                )}
                aria-label="Стек"
              >
                {project.stack.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
            </header>
          </div>

          <div className={styles.projectGalleryDesktop} aria-label="Скриншоты">
            <button
              key={stripScrollInEnd ? "1" : "0"}
              type="button"
              className={`button ${styles.galleryNav} ${styles.galleryNavPrev} ${
                stripRef.current?.scrollLeft !== undefined &&
                stripRef.current.scrollLeft < 3
                  ? styles.galleryNavBlur
                  : ""
              } ${!isGalleryScrollable ? styles.galleryNavHidden : ""}`}
              onClick={() => scrollStrip(-1)}
              aria-label="Прокрутить галерею назад"
              tabIndex={isGalleryScrollable ? 0 : -1}
              aria-hidden={!isGalleryScrollable}
            >
              ‹
            </button>

            <div className={styles.galleryStrip} ref={stripRef}>
              {project.screenshots.map((s) => (
                <button
                  key={s.src + s.alt}
                  type="button"
                  className={clsx(
                    styles.galleryThumbButton,
                    s.isDesktop
                      ? styles.galleryThumbDesktopScreenshot
                      : undefined,
                  )}
                  onClick={() => onOpenLightbox(s.src, s.alt, project.title)}
                  aria-label={`Увеличить: ${s.alt}`}
                >
                  <img
                    className={styles.galleryThumb}
                    src={s.src}
                    alt=""
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            <button
              key={stripScrollInEnd ? "2" : "3"}
              type="button"
              className={`button ${styles.galleryNav} ${styles.galleryNavNext} ${
                stripRef.current?.scrollLeft !== undefined &&
                stripRef.current?.scrollWidth !== undefined &&
                stripRef.current?.clientWidth !== undefined &&
                stripRef.current.scrollWidth - stripRef.current.scrollLeft <
                  stripRef.current.clientWidth + 3
                  ? styles.galleryNavBlur
                  : ""
              } ${!isGalleryScrollable ? styles.galleryNavHidden : ""}`}
              onClick={() => scrollStrip(1)}
              aria-label="Прокрутить галерею вперёд"
              tabIndex={isGalleryScrollable ? 0 : -1}
              aria-hidden={!isGalleryScrollable}
            >
              ›
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProjectCard;
