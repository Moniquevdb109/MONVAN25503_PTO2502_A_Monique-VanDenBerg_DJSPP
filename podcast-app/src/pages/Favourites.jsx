import { useFavourites } from "../context/FavouritesContext";
import { useState } from "react";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import styles from "../styles/Favourites.module.css";
import { useListening } from "../context/ListeningContext";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function decodeTitle(title) {
  return title?.replace(/&amp;/g, "&") ?? title;
}

export default function Favourites() {
  const { favourites, removeFavourite } = useFavourites();
  const { play, pause, isPlaying, currentTrack } = useAudioPlayer();
  const [sortKey, setSortKey] = useState("newest");
  const { resetHistory } = useListening();

  if (favourites.length === 0) {
    return (
      <main className={styles.empty}>
        <p>❤️ No favourites yet — go explore!</p>
      </main>
    );
  }

  // Soft all favourites by selected sort key
    const sorted = [...favourites].sort((a, b) => {
        switch (sortKey) {
            case "newest": return new Date(b.addedAt) - new Date(a.addedAt);
            case "oldest": return new Date(a.addedAt) - new Date(b.addedAt);
            case "a-z":     return a.title.localeCompare(b.title);
            case "z-a":     return b.title.localeCompare(a.title);
            default:        return 0;
        }
    });

  // Group by show title using 'reduce'
  const grouped = sorted.reduce((acc, ep) => {
    const key = decodeTitle(ep.showTitle);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Favourite Episodes</h1>
      <p className={styles.subheading}>Your saved episodes from all shows</p>

      <div className={styles.sortRow}>
        <label className={styles.sortLabel}>Sort by:</label>
        <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
        >
            <option value="newest">Newest Added</option>
            <option value="oldest">Oldest Added</option>
            <option value="a-z">Title A → Z</option>
            <option value="z-a">Title Z → A</option>
        </select>
        <button
            className={styles.resetBtn}
            onClick={() => {
            if (window.confirm("Reset all listening history?")) resetHistory();
            }}
        >
            Reset History
        </button>
        </div>

      {Object.entries(grouped).map(([showTitle, episodes]) => (
        <section key={showTitle} className={styles.group}>
          <h2 className={styles.showTitle}>
            🎙️ {decodeTitle(showTitle)}
            <span className={styles.count}>{episodes.length} episodes</span>
          </h2>

          {episodes.map((ep) => {
            const isThisPlaying = isPlaying && currentTrack?.id === ep.id;
            return (
              <div key={ep.id} className={styles.episodeCard}>
                <img src={ep.image} alt={decodeTitle(ep.showTitle)} className={styles.cover} />   
                <div className={styles.info}>
                  <h3 className={styles.episodeTitle}>{ep.title}</h3>
                  <p className={styles.meta}>
                    {decodeTitle(ep.showTitle)} • Season {ep.season} • Episode {ep.episode}
                    </p>
                  <p className={styles.addedAt}>Added {formatDate(ep.addedAt)}</p>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.playBtn}
                    onClick={() =>
                      isThisPlaying ? pause() : play(ep)
                    }
                    aria-label={isThisPlaying ? "Pause" : "Play"}
                  >
                    {isThisPlaying ? "⏸" : "▶"}
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFavourite(ep.id)}
                    aria-label="Remove from favourites"
                  >
                    ♥
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
}