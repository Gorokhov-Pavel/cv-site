import './App.css'
import profilePhoto from './assets/profile.svg'
import { Projects } from './components/Projects.tsx'

function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="hero">
          <img className="avatar" src={profilePhoto} width={112} height={112} alt="Фото" />
          <div className="heroText">
            <h1 className="name">Имя Фамилия</h1>
            <p className="role">Frontend / Full‑stack разработчик</p>
            <p className="summary">
              Делаю быстрые и аккуратные интерфейсы. Люблю дизайн‑системы, типизацию и
              предсказуемую архитектуру.
            </p>
            <div className="ctaRow">
              <a className="button" href="mailto:you@example.com">
                you@example.com
              </a>
              <a className="button ghost" href="https://github.com/yourname" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="section" aria-labelledby="skills-title">
          <h2 id="skills-title">Навыки</h2>
          <ul className="chips">
            <li>React</li>
            <li>TypeScript</li>
            <li>Vite</li>
            <li>CSS / UI</li>
            <li>Node.js</li>
            <li>REST</li>
          </ul>
        </section>

        <Projects />
      </main>

      <footer className="footer">
        <p className="muted">© {new Date().getFullYear()} Имя Фамилия</p>
      </footer>
    </div>
  )
}

export default App
