import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import p1s1 from '../assets/projects/project-1/screen-1.svg'
import p1s2 from '../assets/projects/project-1/screen-2.svg'
import p1s3 from '../assets/projects/project-1/screen-3.svg'
import p2s1 from '../assets/projects/project-2/screen-1.svg'
import p2s2 from '../assets/projects/project-2/screen-2.svg'

type Project = {
  title: string
  description: string
  stack: string[]
  links?: Array<{ label: string; href: string }>
  screenshots: Array<{ src: string; alt: string }>
}

type LightboxState =
  | { isOpen: false }
  | { isOpen: true; src: string; alt: string; title: string }

const projects: Project[] = [
  {
    title: 'Проект №1',
    description:
      'Короткое описание проекта в 1–2 предложения: что это и какой результат.',
    stack: ['React', 'TypeScript', 'Vite'],
    links: [
      { label: 'Demo', href: 'https://example.com' },
      { label: 'Code', href: 'https://github.com/yourname/project' },
    ],
    screenshots: [
      { src: p1s1, alt: 'Экран 1' },
      { src: p1s2, alt: 'Экран 2' },
      { src: p1s3, alt: 'Экран 3' },
    ],
  },
  {
    title: 'Проект №2',
    description:
      'Ещё один проект. Тут можно подчеркнуть интересную фичу: офлайн, анимации, оптимизация и т.д.',
    stack: ['React', 'CSS', 'API'],
    screenshots: [
      { src: p2s1, alt: 'Экран 1' },
      { src: p2s2, alt: 'Экран 2' },
    ],
  },
]

function ProjectCard({
  project,
  onOpenLightbox,
  firstSlideRef,
}: {
  project: Project
  onOpenLightbox: (src: string, alt: string, title: string) => void
  firstSlideRef?: RefObject<HTMLElement | null>
}) {
  const labelIdMobile = useId()
  const labelIdDesktop = useId()
  const stripRef = useRef<HTMLDivElement>(null)

  function scrollStrip(dir: -1 | 1) {
    const el = stripRef.current
    if (!el) return
    const step = Math.max(220, Math.floor(el.clientWidth * 0.75))
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="projectCardWrap">
      <div className="projectSlidesMobile">
        {project.screenshots.map((s, i) => (
          <article
            key={`${project.title}-m-${i}`}
            ref={i === 0 ? firstSlideRef : undefined}
            className={`projectSlide ${i === 0 ? 'projectSlideFirst' : ''}`}
            style={{ backgroundImage: `url(${s.src})` }}
            aria-labelledby={i === 0 ? labelIdMobile : undefined}
          >
            <div className="projectCardBg" aria-hidden="true" />

            {i === 0 ? (
              <div className="projectOverlay">
                <header className="projectHeader projectHeaderOverlay">
                  <div className="projectTitleRow">
                    <h3 className="projectTitle projectTitleOverlay" id={labelIdMobile}>
                      {project.title}
                    </h3>
                    {project.links?.length ? (
                      <div className="projectLinks">
                        {project.links.map((l) => (
                          <a
                            key={l.href}
                            className="projectLink projectLinkOverlay"
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
                  <p className="projectDescription projectDescriptionOverlay">{project.description}</p>
                  <ul className="chips chipsSm chipsOverlay" aria-label="Стек">
                    {project.stack.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ul>
                </header>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="projectSlideHit"
                  aria-label={`Увеличить: ${s.alt}`}
                  onClick={() => onOpenLightbox(s.src, s.alt, project.title)}
                />
                <div className="projectSlideCaptionBar" aria-hidden="true">
                  <span className="projectSlideCaption">{s.alt}</span>
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      <article
        className="projectCard projectCardHero projectCardDesktop"
        aria-labelledby={labelIdDesktop}
      >
        <div className="projectDesktopInner">
          <div className="projectOverlay">
            <header className="projectHeader projectHeaderOverlay">
              <div className="projectTitleRow">
                <h3 className="projectTitle projectTitleOverlay" id={labelIdDesktop}>
                  {project.title}
                </h3>
                {project.links?.length ? (
                  <div className="projectLinks">
                    {project.links.map((l) => (
                      <a
                        key={l.href}
                        className="projectLink projectLinkOverlay"
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
              <p className="projectDescription projectDescriptionOverlay">{project.description}</p>
              <ul className="chips chipsSm chipsOverlay" aria-label="Стек">
                {project.stack.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
            </header>
          </div>

          <div className="projectGalleryDesktop" aria-label="Скриншоты">
            <button
              type="button"
              className="galleryNav galleryNavPrev"
              onClick={() => scrollStrip(-1)}
              aria-label="Прокрутить галерею назад"
            >
              ‹
            </button>
            <div className="galleryStrip" ref={stripRef}>
              {project.screenshots.map((s) => (
                <button
                  key={s.src}
                  type="button"
                  className="galleryThumbButton"
                  onClick={() => onOpenLightbox(s.src, s.alt, project.title)}
                  aria-label={`Увеличить: ${s.alt}`}
                >
                  <img className="galleryThumb" src={s.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="galleryNav galleryNavNext"
              onClick={() => scrollStrip(1)}
              aria-label="Прокрутить галерею вперёд"
            >
              ›
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export function Projects() {
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false })
  const sectionRef = useRef<HTMLElement>(null)
  const firstProjectSlideRef = useRef<HTMLElement>(null)
  const snapEngagedRef = useRef(false)

  useEffect(() => {
    const SNAP = 'snapProjects'
    const root = document.documentElement
    const mq = window.matchMedia('(max-width: 719px)')

    function clearSnap() {
      snapEngagedRef.current = false
      root.classList.remove(SNAP)
    }

    function updateSnap() {
      if (!mq.matches) {
        clearSnap()
        return
      }

      const slide = firstProjectSlideRef.current
      const section = sectionRef.current
      if (!slide || !section) return

      const vh = window.innerHeight
      const slideRect = slide.getBoundingClientRect()
      const visiblePx = Math.max(0, Math.min(slideRect.bottom, vh) - Math.max(slideRect.top, 0))
      const sectionTopDoc = section.getBoundingClientRect().top + window.scrollY
      const aboveProjects = window.scrollY < sectionTopDoc - 32

      if (aboveProjects) {
        clearSnap()
        return
      }

      if (visiblePx >= vh * 0.5) {
        snapEngagedRef.current = true
      }

      if (snapEngagedRef.current) {
        root.classList.add(SNAP)
      } else {
        root.classList.remove(SNAP)
      }
    }

    updateSnap()
    window.addEventListener('scroll', updateSnap, { passive: true })
    window.addEventListener('resize', updateSnap)
    mq.addEventListener('change', updateSnap)

    return () => {
      window.removeEventListener('scroll', updateSnap)
      window.removeEventListener('resize', updateSnap)
      mq.removeEventListener('change', updateSnap)
      clearSnap()
    }
  }, [])

  function openLightbox(src: string, alt: string, title: string) {
    setLightbox({ isOpen: true, src, alt, title })
  }

  function closeLightbox() {
    setLightbox({ isOpen: false })
  }

  return (
    <section ref={sectionRef} className="section sectionProjects" aria-labelledby="projects-title">
      <div className="sectionHeader">
        <h2 id="projects-title">Проекты</h2>
        <p className="muted">
          На мобилке прилипание к полноэкранным скринам включается, когда первый проект занял не меньше половины экрана; выше — обычный скролл. На десктопе — текст сверху и ряд миниатюр.
        </p>
      </div>

      <div className="projectsGrid">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.title}
            project={p}
            onOpenLightbox={openLightbox}
            firstSlideRef={i === 0 ? firstProjectSlideRef : undefined}
          />
        ))}
      </div>

      {lightbox.isOpen ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Скриншот проекта: ${lightbox.title}`}
          onClick={closeLightbox}
        >
          <div className="lightboxInner" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightboxClose" onClick={closeLightbox} aria-label="Закрыть">
              ✕
            </button>
            <img className="lightboxImg" src={lightbox.src} alt={lightbox.alt} />
          </div>
        </div>
      ) : null}
    </section>
  )
}

