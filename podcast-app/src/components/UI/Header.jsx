import styles from "../../styles/Header.module.css";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "react-router-dom";
import { useFavourites } from "../../context/FavouritesContext";

/**
 * Header — sticky top navigation bar rendered across all pages.
 * Displays the app brand/logo, navigation links, and theme toggle.
 * Shows a badge on the Favourites link indicating the number of saved episodes.
 *
 * @returns {JSX.Element}
 */
export default function Header() {
  const { favourites } = useFavourites();

  return (
    <header className={styles.appHeader}>
      <NavLink to="/" className={styles.brand}>
        <h1 className={styles.appTitle}>🎙️ Podcast App</h1>
      </NavLink>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          ♥ Favourites
          {favourites.length > 0 && (
            <span className={styles.badge}>{favourites.length}</span>
          )}
        </NavLink>
      </nav>
      
      <ThemeToggle />
    </header>
  );
}