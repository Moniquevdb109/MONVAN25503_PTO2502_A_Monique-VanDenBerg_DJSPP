import styles from "../../styles/Header.module.css";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.appTitle}>🎙️ Podcast App</h1>
      <ThemeToggle />
    </header>
  );
}