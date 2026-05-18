import { useEffect, useId, useRef, useState, type RefObject } from "react";
import styles from "./ProjectCard.module.css";
import clsx from "clsx";
import type { MobileSlideContent, Project } from "../../types";

const GALLERY_NAV_WIDTH = 52;
const GALLERY_NAV_GAP = 12;
const MIN_SCROLL_STEP = 220;
const OVERLAY_TIMEOUT_MS = 5000;

export function ProjectCard({
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

  const [isScrollAtEnd, setIsScrollAtEnd] = useState(true);

  const galleryScrollableRef = useRef(false);
  const hideOverlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Split outro into sentences for distribution across slides
  const outroSentences = project.outro
    ? project.outro.split(/(?<=[.!?])\s+/).filter((s) => s.trim())
    : [];

  // Calculate if gallery needs scroll navigation
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const parent = el.parentElement;
    const navButton = parent?.querySelector<HTMLButtonElement>(
      "." + styles.galleryNav,
    );

    const navWidth = navButton?.clientWidth ?? GALLERY_NAV_WIDTH;

    const updateGalleryScroll = () => {
      const containerWidth = parent?.clientWidth ?? el.clientWidth;
      const availableWidth = Math.max(
        0,

        containerWidth - (navWidth * 2 + GALLERY_NAV_GAP),
      );
      const nextScrollable = el.scrollWidth > availableWidth + 1;

      if (nextScrollable !== galleryScrollableRef.current) {
        galleryScrollableRef.current = nextScrollable;
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

  // Scroll gallery strip
  const scrollStrip = (dir: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;

    const step = Math.max(MIN_SCROLL_STEP, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Handle overlay visibility
  const hideOverlay = () => {
    if (hideOverlayTimeoutRef.current) {
      clearTimeout(hideOverlayTimeoutRef.current);
    }
    setIsOverlayHidden(true);
    hideOverlayTimeoutRef.current = setTimeout(() => {
      setIsOverlayHidden(false);
    }, OVERLAY_TIMEOUT_MS);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideOverlayTimeoutRef.current) {
        clearTimeout(hideOverlayTimeoutRef.current);
      }
    };
  }, []);

  // Determine content for mobile slides
  const getMobileSlideContent = (
    slideIndex: number,
    slidesLength: number,
  ): MobileSlideContent => {
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
  };

  // Handle scroll position for gallery navigation
  const handleStripScroll = () => {
    if (!stripRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = stripRef.current;
    setIsScrollAtEnd(
      scrollLeft < 3 || Math.abs(scrollWidth - scrollLeft - clientWidth) < 3,
    );
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleStripScroll);
    return () => el.removeEventListener("scroll", handleStripScroll);
  }, []);

  return (
    <div className={styles.projectCardWrap}>
      {/* Mobile View */}
      <div className={styles.projectSlidesMobile}>
        {project.screenshots.map((s, i) => {
          const content = getMobileSlideContent(i, project.screenshots.length);

          return (
            <article
              key={`${project.title}-m-${i}`}
              ref={i === 0 ? firstSlideRef : undefined}
              className={clsx(
                styles.projectSlide,
                i === 0 && styles.projectSlideFirst,
                isZoomed && styles.projectSlideZoomed,
                s.isDesktop && styles.projectSlideDesktopScreenshot,
              )}
              style={{ backgroundImage: `url(${s.src})` }}
              aria-labelledby={i === 0 ? labelIdMobile : undefined}
            >
              <div className={styles.projectCardBg} aria-hidden="true" />

              <div
                className={clsx(
                  styles.projectOverlay,
                  isZoomed || isOverlayHidden
                    ? styles.projectOverlayHidden
                    : styles.projectOverlayVisible,
                )}
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
                          {project.links.map((link) => (
                            <a
                              key={link.href}
                              className={clsx(
                                styles.projectLink,
                                styles.projectLinkOverlay,
                              )}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {link.label}
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

                  {content.showTeam && project.team && (
                    <p
                      className={clsx(
                        styles.projectTeam,
                        styles.projectDescriptionOverlay,
                      )}
                    >
                      {project.team}
                    </p>
                  )}
                  {content.showOutro && (
                    <p
                      className={clsx(
                        styles.projectDescription,
                        styles.projectDescriptionOverlay,
                      )}
                    >
                      {content.outroText}
                    </p>
                  )}
                  {content.showStack && (
                    <ul
                      className={clsx(
                        styles.chips,
                        styles.chipsSm,
                        styles.chipsOverlay,
                      )}
                      aria-label="Стек"
                    >
                      {project.stack.map((stackItem) => (
                        <li key={stackItem}>{stackItem}</li>
                      ))}
                    </ul>
                  )}
                </header>
              </div>

              {i !== 0 && !content.showTeam && !content.showOutro && (
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
              )}
            </article>
          );
        })}
      </div>

      {/* Desktop View */}
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
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        className={clsx(
                          styles.projectLink,
                          styles.projectLinkOverlay,
                        )}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
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
                <p
                  className={clsx(
                    styles.projectTeam,
                    styles.projectDescriptionOverlay,
                  )}
                >
                  {project.team}
                </p>
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
                {project.stack.map((stackItem) => (
                  <li key={stackItem}>{stackItem}</li>
                ))}
              </ul>
            </header>
          </div>

          <div className={styles.projectGalleryDesktop} aria-label="Скриншоты">
            <button
              key={isScrollAtEnd ? "1" : "0"}
              type="button"
              className={clsx(
                "button",
                styles.galleryNav,
                styles.galleryNavPrev,
                stripRef.current?.scrollLeft !== undefined &&
                  stripRef.current.scrollLeft < 3 &&
                  styles.galleryNavBlur,
                !isGalleryScrollable && styles.galleryNavHidden,
              )}
              onClick={() => scrollStrip(-1)}
              aria-label="Прокрутить галерею назад"
              tabIndex={isGalleryScrollable ? 0 : -1}
              aria-hidden={!isGalleryScrollable}
            >
              ‹
            </button>

            <div className={styles.galleryStrip} ref={stripRef}>
              {project.screenshots.map((screenshot) => (
                <button
                  key={screenshot.src + screenshot.alt}
                  type="button"
                  className={clsx(
                    styles.galleryThumbButton,

                    screenshot.isDesktop &&
                      styles.galleryThumbDesktopScreenshot,
                  )}
                  onClick={() =>
                    onOpenLightbox(
                      screenshot.src,
                      screenshot.alt,
                      project.title,
                    )
                  }
                  aria-label={`Увеличить: ${screenshot.alt}`}
                >
                  <img
                    className={styles.galleryThumb}
                    src={screenshot.src}
                    alt=""
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            <button
              key={isScrollAtEnd ? "2" : "3"}
              type="button"
              className={clsx(
                "button",
                styles.galleryNav,
                styles.galleryNavNext,
                stripRef.current?.scrollLeft !== undefined &&
                  stripRef.current?.scrollWidth !== undefined &&
                  stripRef.current?.clientWidth !== undefined &&
                  Math.abs(
                    stripRef.current.scrollWidth -
                      stripRef.current.scrollLeft -
                      stripRef.current.clientWidth,
                  ) < 3 &&
                  styles.galleryNavBlur,
                !isGalleryScrollable && styles.galleryNavHidden,
              )}
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
