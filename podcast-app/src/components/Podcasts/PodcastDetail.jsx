import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import styles from "../../styles/PodcastDetail.module.css";

/**
 * SeasonNav — season selector dropdown and episode list.
 * Built inside PodcastDetail since it's only used here.
 *
 * @param {{ seasons: Array }} props
 * @returns {JSX.Element}
 */
function SeasonNav({ seasons }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen]   = useState(false);

  if (!seasons || seasons.length === 0) {
    return <p className={styles.empty}>No seasons available.</p>;
  }

  const currentSeason = seasons[selectedIndex];

  /**
   * Truncates episode description to 160 characters.
   * @param {string} text
   * @returns {string}
   */
  function truncate(text, limit = 160) {
    if (!text) return "No description available.";
    return text.length > limit ? text.slice(0, limit).trimEnd() + "…" : text;
  }

  return (
    <section className={styles.seasonNav}>
      {/* Dropdown to switch seasons */}
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

      {/* Season summary */}
      <div className={styles.seasonSummary}>
        <img src={currentSeason.image} alt={currentSeason.title} className={styles.seasonCover} />
        <div>
          <h3 className={styles.seasonTitle}>{currentSeason.title}</h3>
          <p className={styles.seasonMeta}>
            {currentSeason.episodes.length} Episode{currentSeason.episodes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Episode list */}
      <div className={styles.episodeList}>
        {currentSeason.episodes.map((ep) => (
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
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * PodcastDetail — full show detail view.
 * Displays hero card with show info and SeasonNav below.
 *
 * @param {Object}   props
 * @param {Object}   props.podcast - Full show object with seasons and episodes
 * @param {Array}    props.genres  - Genre definitions for ID → label resolution
 * @param {Function} props.onBack  - Navigates back to the home page
 * @returns {JSX.Element}
 */
export default function PodcastDetail({ podcast, genres, onBack }) {

  /**
   * Resolves genre ID numbers to human-readable title strings.
   * @param {number[]} ids
   * @returns {string[]}
   */
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

      {/* Top navigation bar */}
      <header className={styles.topBar}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <span className={styles.appName}>🎙️ Podcast App</span>
      </header>

      <main className={styles.content}>

        {/* Hero card — show image + metadata */}
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
                <span className={styles.metaValue}>
                  {formatDate(podcast.updated)}
                </span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>TOTAL SEASONS</span>
                <span className={styles.metaValue}>
                  {podcast.seasons?.length ?? 0} Season{podcast.seasons?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>TOTAL EPISODES</span>
                <span className={styles.metaValue}>
                  {totalEpisodes} Episodes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Season navigation + episode list */}
        <SeasonNav seasons={podcast.seasons ?? []} />

      </main>
    </div>
  );
}
