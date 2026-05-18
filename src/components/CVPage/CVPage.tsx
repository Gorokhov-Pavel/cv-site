import { useState } from "react";
import styles from "./CVPage.module.css";
import { Projects } from "../Projects/Projects.tsx";
import { cvPageHead, skills } from "../../data.ts";
import clsx from "clsx";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import type { LightboxState } from "../../types/index.ts";

function CVPage() {
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false });
  const [showScrollButton, setShowScrollButton] = useState(false);

  function openLightbox(src: string, alt: string, title: string) {
    setLightbox({ isOpen: true, src, alt, title });
  }

  function closeLightbox() {
    setLightbox({ isOpen: false });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleScroll() {
    setShowScrollButton(window.scrollY > 100);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }

  return (
    <div className={styles["cv-page"]}>
      <header className={styles.header}>
        <div className={styles.hero}>
          <img
            className={styles.avatar}
            src={cvPageHead.avatar.src}
            width={112}
            height={112}
            alt={cvPageHead.avatar.alt}
            onClick={() =>
              openLightbox(
                cvPageHead.avatar.src,
                cvPageHead.avatar.alt,
                cvPageHead.avatar.alt,
              )
            }
          />
          <div className={styles.heroText}>
            <h1 className={styles.name}>{cvPageHead.name}</h1>
            <p className={styles.role}>{cvPageHead.role}</p>
            <p className={styles.summary}>{cvPageHead.summary}</p>
            <div className={styles.ctaRow}>
              {/*<a className="button" href="mailto:you@example.com">
                {cvPageHead.}
              </a>*/}
              <a
                className={clsx("button", "ghost")}
                href={cvPageHead.githubButton.href}
                target="_blank"
                rel="noreferrer"
              >
                {cvPageHead.githubButton.label}
              </a>
              <a
                className="button"
                href={cvPageHead.downloadCVButton.href}
                download
              >
                {cvPageHead.downloadCVButton.label}
              </a>
            </div>
          </div>
        </div>
        <ThemeSwitcher />
      </header>

      <main className={styles.main}>
        <section className="section" aria-labelledby="skills-title">
          <h2 id="skills-title">{skills.title}</h2>
          <ul className={styles["skills-list"]}>
            {skills.list.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        </section>

        <Projects openLightbox={openLightbox} />
      </main>

      <footer className={styles.footer}>
        <p className="muted">{"© 2026 " + cvPageHead.name}</p>
        <button
          type="button"
          className={`button ${styles.scrollToTop} ${showScrollButton ? "" : styles.hidden}`}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <span className={styles.scrollToTopText}>Наверх</span>
          <span className={styles.scrollToTopIcon}>↑</span>
        </button>
      </footer>

      {lightbox.isOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          //aria-label={`Скриншот проекта: ${lightbox.title}`}
          onClick={closeLightbox}
        >
          <div
            className={styles.lightboxInner}
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              //onClick={closeLightbox}
              aria-label="Закрыть"
            >
              ✕
            </button>
            <img
              className={styles.lightboxImg}
              src={lightbox.src}
              alt={lightbox.alt}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CVPage;
