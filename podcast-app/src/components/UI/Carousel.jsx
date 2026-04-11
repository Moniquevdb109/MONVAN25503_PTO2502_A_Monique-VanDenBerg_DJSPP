import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "../../data";
import styles from "../../styles/Carousel.module.css";

export default function Carousel({ shows }) {
  const scrollRef = useRef(null);
  const navigate  = useNavigate();

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

  function resolveGenres(ids = []) {
    return ids.map((id) => {
      const match = genres.find((g) => g.id === id);
      return match ? match.title : null;
    }).filter(Boolean);
  }

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
        {loopedShows.map((show) => (
          <div
            key={show.id}
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