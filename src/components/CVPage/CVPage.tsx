import { useState } from 'react'
import './CVPage.css'
import profilePhoto from '../../assets/profile.svg'
import { Projects } from '../Projects/Projects.tsx'

type LightboxState =
  | { isOpen: false }
  | { isOpen: true; src: string; alt: string; title: string }

function CVPage() {
  const [lightbox, setLightbox] = useState<LightboxState>({ isOpen: false })
  const [showScrollButton, setShowScrollButton] = useState(false)

  function openLightbox(src: string, alt: string, title: string) {
    setLightbox({ isOpen: true, src, alt, title })
  }

  function closeLightbox() {
    setLightbox({ isOpen: false })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleScroll() {
    setShowScrollButton(window.scrollY > 100)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  return (
    <div className="cv-page">
      <header className="header">
        <div className="hero">
          <img className="avatar" src={profilePhoto} width={112} height={112} alt="Фото" onClick={() => openLightbox(profilePhoto, "Фото", "Фото")}/>
          <div className="heroText">
            <h1 className="name">Горохов Павел</h1>
            <p className="role">Frontend / React Native разработчик</p>
            <p className="summary">
              Имею опыт работы в коммерческих проектах, проектах в сфере детского образования, продуктовой-аналитики. Знаком с методологиями Agile, Scrum.
            </p>
            <div className="ctaRow">
              {/*<a className="button" href="mailto:you@example.com">
                you@example.com
              </a>*/}
              <a className="button ghost" href="https://github.com/yourname" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="button resume" href="/resume.pdf" download>
                📥 Скачать резюме (PDF)
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="section" aria-labelledby="skills-title">
          <h2 id="skills-title">Основные компетенции и навыки:</h2>
          <ul className="skills-list">
            <li>Создание и поддержка веб-сайтов и SPA приложений на React/TypeScript.</li>
            <li>Участие в разработке дизайн-системы React-компонентов.</li>
            <li>Разработка клиентской части на next.js.</li>
            <li>Использование в клиентской части Redux.</li>
            <li>Создание с "0" приложений на React native, поддержка и реконструкция, верстка, роутинг, взаимодействие с бэкендом.</li>
            <li>Взаимодействие с бэкендом с использованием REST API, GraphQL, WebSocket.</li>
            <li>Улучшение функциональности действующих продуктов посредством рефакторинга кода.</li>
            <li>Оптимизация, баг-фиксинг.</li>
            <li>Портирование React native приложений на iOS и android, cоздание с 0 до выпуска приложений.</li>
            <li>Использование нейросетей, в том числе локальных моделей, для ускорения написания кода.</li>
          </ul>
        </section>

        <Projects openLightbox={openLightbox} />
      </main>

      <footer className="footer">
        <p className="muted">© {new Date().getFullYear()} Имя Фамилия</p>
        <button
          type="button"
          className={`scrollToTop ${showScrollButton ? '' : 'hidden'}`}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <span className="scrollToTopText">Наверх</span>
          <span className="scrollToTopIcon">↑</span>
        </button>
      </footer>

      {lightbox.isOpen ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          //aria-label={`Скриншот проекта: ${lightbox.title}`}
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
    </div>
  )
}

export default CVPage

