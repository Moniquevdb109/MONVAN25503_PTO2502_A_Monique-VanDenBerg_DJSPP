import { useTheme } from "../../context/ThemeContext";
import styles from "../../styles/ThemeToggle.module.css";

/**
 * ThemeToggle — button that switches between light and dark mode.
 * Displays a moon icon in light mode and a sun icon in dark mode.
 * Reads and updates theme state via ThemeContext.
 *
 * @returns {JSX.Element}
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
       {/* Moon icon indicates clicking will switch to dark mode, sun for light */}
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}