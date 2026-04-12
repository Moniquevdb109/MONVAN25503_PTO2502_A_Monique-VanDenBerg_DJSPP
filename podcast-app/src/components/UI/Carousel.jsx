import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "../../data";
import styles from "../../styles/Carousel.module.css";

/**
 * Carousel — horizontally scrollable recommended shows carousel.
 * Displays a looping list of show cards with image, title, and genre tags.
 * Supports arrow navigation and loops back to the start when the end is reached.
 *
 * @param {Object} props
 * @param {Array}  props.shows - Array of podcast preview objects to display.
 * @returns {JSX.Element}
 */

export default function Carousel({ shows }) {
  const scrollRef = useRef(null);
  const navigate  = useNavigate();

   /**
   * Scrolls the carousel left or right by a fixed amount.
   * Loops back to the start when the end is reached and vice versa.
   * @param {"left" | "right"} direction - The direction to scroll.
   */

  function scroll(direction) {
    const container = scrollRef.current;
    const amount    = 320;
   
    if (direction === "right") {
      // If near the end, jump back to start
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({ left: amount, behavior: "smooth" });
      }
    } else {
      // If at the start, jump to end
      if (container.scrollLeft <= 0) {
        container.scrollLeft = container.scrollWidth;
      } else {
        container.scrollBy({ left: -amount, behavior: "smooth" });
      }
    }
  }

  /**
   * Resolves genre IDs to human-readable genre title strings.
   * @param {number[]} ids - Array of genre ID numbers.
   * @returns {string[]} Array of matching genre title strings.
   */
  function resolveGenres(ids = []) {
    return ids.map((id) => {
      const match = genres.find((g) => g.id === id);
      return match ? match.title : null;
    }).filter(Boolean);
  }
  
  /**
   * Triple the shows array to create a looping effect.
   * Using index in the key ensures uniqueness across duplicates.
   */

  const loopedShows = [...shows, ...shows, ...shows];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recommended Shows</h2>
        <div className={styles.arrows}>
          <button
            className={styles.arrow}
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            className={styles.arrow}
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.track} ref={scrollRef}>
        {loopedShows.map((show, index) => (
          <div
            key={`${show.id}-${index}`}
            className={styles.card}
            onClick={() => navigate(`/show/${show.id}`)}
          >
            <img src={show.image} alt={show.title} className={styles.image} />
            <h3 className={styles.showTitle}>{show.title}</h3>
            <div className={styles.tags}>
              {resolveGenres(show.genres).map((g) => (
                <span key={g} className={styles.tag}>{g}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}