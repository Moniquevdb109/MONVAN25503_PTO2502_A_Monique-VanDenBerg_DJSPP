import { useTheme } from "../../context/ThemeContext";
import styles from "../../styles/ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}