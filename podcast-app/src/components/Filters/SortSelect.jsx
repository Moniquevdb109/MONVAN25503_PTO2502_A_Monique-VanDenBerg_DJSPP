import { SORT_OPTIONS, usePodcast } from "../../context/PodcastContext";
import styles from "../../styles/SortSelect.module.css";

/**
 * Dropdown for choosing sort order.
 */
export default function SortSelect() {
  const { sortKey, setSortKey } = usePodcast();

  return (
    <select
      className={styles.select}
      value={sortKey}
      onChange={(e) => setSortKey(e.target.value)}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
