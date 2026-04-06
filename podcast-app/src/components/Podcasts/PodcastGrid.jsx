import { usePodcast } from "../../context/PodcastContext";
import PodcastCard from "./PodcastCard";
import styles from "../../styles/PodcastGrid.module.css";


/**
 * PodcastGrid Component
 *
 * Renders a responsive grid of podcast preview cards using filtered and paginated
 * podcast data from context. Each card displays a podcast’s metadata including
 * title, image, genres, season count, and last updated date.
 *
 * If the filtered list is empty, it displays a user-friendly "no results" message.
 *
 * @component
 * @param {Object} props - Component props
 * @param {{id: number, name: string}[]} props.genres - Array of genre definitions used to resolve genre IDs in each podcast
 *
 * @returns {JSX.Element} A grid of <PodcastCard> components or a message if no results are found
 */
export default function PodcastGrid({ genres, onShowClick }) {
  const { podcasts } = usePodcast();

  if (!podcasts.length) {
    return (
      <p className={styles.noResults}>
        No podcasts match your search or filters.
      </p>
    );
  }
  return (
    <>
      <div className={styles.grid}>
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} genres={genres} onClick={() => onShowClick(podcast.id)} />
        ))}
      </div>
    </>
  );
}
