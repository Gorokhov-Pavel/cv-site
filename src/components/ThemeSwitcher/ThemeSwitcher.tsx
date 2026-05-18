import { useState, useEffect } from "react";
import styles from "./ThemeSwitcher.module.css";
import type { Theme } from "../../types";

const LOCAL_STORAGE_KEY = "theme";
const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Toggle theme and persist preference
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      type="button"
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={`Переключить на ${theme === "light" ? "темную" : "светлую"} тему`}
      title={`Текущая тема: ${theme}`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeSwitcher;