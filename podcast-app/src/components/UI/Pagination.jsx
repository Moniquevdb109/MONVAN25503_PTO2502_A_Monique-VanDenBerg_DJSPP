import { usePodcast } from "../../context/PodcastContext";
import styles from "../../styles/Pagination.module.css";

/**
 * Numeric pagination bar.
 */
export default function Pagination() {
  const { page, setPage, totalPages } = usePodcast();

  if (totalPages <= 1) return null;

  /**
   * Build page list.
   */
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginationWrapper}>
      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.pageButton} ${p === page ? styles.active : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
