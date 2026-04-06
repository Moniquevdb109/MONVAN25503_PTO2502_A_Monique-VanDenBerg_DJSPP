import styles from "../../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.appTitle}>🎙️ Podcast App</h1>
    </header>
  );
}