import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import styles from "../../styles/PodcastDetail.module.css";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { useFavourites } from "../../context/FavouritesContext";

function SeasonNav({ seasons, podcast }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const { play, pause, isPlaying, currentTrack } = useAudioPlayer();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();

  if (!seasons || seasons.length === 0) {
    return <p className={styles.empty}>No seasons available.</p>;
  }

  const currentSeason = seasons[selectedIndex];

  function truncate(text, limit = 160) {
    if (!text) return "No description available.";
    return text.length > limit ? text.slice(0, limit).trimEnd() + "…" : text;
  }

  return (
    <section className={styles.seasonNav}>
      <div className={styles.seasonHeader}>
        <h2 className={styles.sectionTitle}>Current Season</h2>
        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownTrigger}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
          >
            {currentSeason.title}
            <span className={styles.chevron}>{dropdownOpen ? "▲" : "▼"}</span>
          </button>
          {dropdownOpen && (
            <ul className={styles.dropdownList}>
              {seasons.map((s, i) => (
                <li
                  key={s.season}
                  className={`${styles.dropdownItem} ${i === selectedIndex ? styles.dropdownItemActive : ""}`}
                  onClick={() => { setSelectedIndex(i); setDropdownOpen(false); }}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.seasonSummary}>
        <img src={currentSeason.image} alt={currentSeason.title} className={styles.seasonCover} />
        <div>
          <h3 className={styles.seasonTitle}>{currentSeason.title}</h3>
          <p className={styles.seasonMeta}>
            {currentSeason.episodes.length} Episode{currentSeason.episodes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className={styles.episodeList}>
        {currentSeason.episodes.map((ep) => {
          const trackId = `${podcast.id}-${currentSeason.season}-${ep.episode}`;
          const isThisPlaying = isPlaying && currentTrack?.id === trackId;
          return (
            <div key={ep.episode} className={styles.episodeCard}>
              <div className={styles.episodeBadge}>
                <img src={currentSeason.image} alt="" className={styles.episodeThumb} />
                <span className={styles.episodeLabel}>S{currentSeason.season}</span>
              </div>
              <div className={styles.episodeBody}>
                <p className={styles.episodeNumber}>Episode {ep.episode}</p>
                <h4 className={styles.episodeTitle}>{ep.title}</h4>
                <p className={styles.episodeDescription}>{truncate(ep.description)}</p>
              </div>
              <button
                className={`${styles.heartBtn} ${isFavourite(trackId) ? styles.heartActive : ""}`}
                onClick={() =>
                  isFavourite(trackId)
                    ? removeFavourite(trackId)
                    : addFavourite({
                        id: trackId,
                        file: ep.file,
                        title: ep.title,
                        showTitle: podcast.title,
                        image: currentSeason.image,
                      })
                }
                aria-label={isFavourite(trackId) ? "Remove from favourites" : "Add to favourites"}
              >
                {isFavourite(trackId) ? "♥" : "♡"}
              </button>
              <button
                className={styles.playBtn}
                onClick={() => {
                  const playlist = currentSeason.episodes.map((e) => ({
                    id: `${currentSeason.season}-${e.episode}`,
                    file: e.file,
                    title: e.title,
                    showTitle: podcast.title,
                    image: currentSeason.image,
                  }));
                  isThisPlaying ? pause() : play({
                    id: trackId,
                    file: ep.file,
                    title: ep.title,
                    showTitle: podcast.title,
                    image: currentSeason.image,
                  }, playlist);
                }}
                aria-label={isThisPlaying ? "Pause" : "Play"}
              >
                {isThisPlaying ? "⏸" : "▶"}
              </button>
            </div>
          );
        })
      }
      </div>
    </section>
  );
}

export default function PodcastDetail({ podcast, genres, onBack }) {
  function resolveGenres(ids = []) {
    return ids.map((id) => {
      const match = genres.find((g) => g.id === id);
      return match ? match.title : `Genre ${id}`;
    });
  }

  const genreLabels = resolveGenres(podcast.genres);

  const totalEpisodes = (podcast.seasons ?? []).reduce(
    (sum, s) => sum + (s.episodes?.length ?? 0),
    0
  );

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.heroCard}>
          <img
            src={podcast.image}
            alt={`${podcast.title} cover`}
            className={styles.heroImage}
          />
          <div className={styles.heroDetails}>
            <h1 className={styles.showTitle}>{podcast.title}</h1>
            <p className={styles.showDescription}>{podcast.description}</p>
            <div className={styles.metaGrid}>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>GENRES</span>
                <GenreTags labels={genreLabels} />
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>LAST UPDATED</span>
                <span className={styles.metaValue}>{formatDate(podcast.updated)}</span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>TOTAL SEASONS</span>
                <span className={styles.metaValue}>
                  {podcast.seasons?.length ?? 0} Season{podcast.seasons?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>TOTAL EPISODES</span>
                <span className={styles.metaValue}>{totalEpisodes} Episodes</span>
              </div>
            </div>
          </div>
        </section>

        <SeasonNav seasons={podcast.seasons ?? []} podcast={podcast} />
      </main>
    </div>
  );
}