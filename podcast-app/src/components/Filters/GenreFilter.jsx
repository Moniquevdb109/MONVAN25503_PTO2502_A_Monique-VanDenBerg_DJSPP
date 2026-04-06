import { usePodcast } from "../../context/PodcastContext";
import styles from "../../styles/GenreFilter.module.css";


/**
 * @param {{genres: {id:number,name:string}[]}} props – list of genres from data.
 */
export default function GenreFilter({ genres }) {
  const { genre, setGenre } = usePodcast();

  return (
    <select
      className={styles.select}
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
    >
      <option value="all">All Genres</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.title}
        </option>
      ))}
    </select>
  );
}
