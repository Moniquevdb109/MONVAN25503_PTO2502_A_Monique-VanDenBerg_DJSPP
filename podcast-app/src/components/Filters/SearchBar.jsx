import { useState, useEffect } from "react";
import { usePodcast } from "../../context/PodcastContext";
import styles from "../../styles/SearchBar.module.css";

/**
 * Search input with debounced update.
 */
export default function SearchBar() {
  const { search, setSearch } = usePodcast();
  const [value, setValue] = useState(search);

  // Debounce input (300ms) to avoid rapid updates.
  useEffect(() => {
    const id = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <input
      type="search"
      placeholder="Search podcasts…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.searchInput}
    />
  );
}
