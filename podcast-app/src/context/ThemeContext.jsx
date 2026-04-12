import { createContext, useContext, useEffect, useState } from "react";

/**
 * @module ThemeContext
 * Global theme context. Manages light/dark mode toggle and persists
 * the user's theme preference to localStorage across sessions.
 */

const ThemeContext = createContext();

/**
 * Custom hook to consume ThemeContext.
 * Use this instead of useContext(ThemeContext) everywhere.
 *
 * @returns {Object} Theme context value containing theme and toggleTheme.
 */
export function useTheme() {
  return useContext(ThemeContext);
}


/**
 * ThemeProvider — wraps the app and provides shared theme state.
 * Applies the theme by setting a data-theme attribute on the root
 * HTML element, which CSS variables use to switch colour schemes.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  /**
   * Initialise theme from localStorage.
   * Falls back to "light" if no preference has been saved.
   */
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

    /**
   * Applies the current theme to the document and saves it to localStorage.
   * Sets data-theme on <html> so all CSS variables update automatically.
   */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

    /**
   * Toggles between light and dark mode.
   */
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}