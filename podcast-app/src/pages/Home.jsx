import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SearchBar   from "../components/Filters/SearchBar";
import GenreFilter from "../components/Filters/GenreFilter";
import SortSelect  from "../components/Filters/SortSelect";
import PodcastGrid from "../components/Podcasts/PodcastGrid";
import Pagination  from "../components/UI/Pagination";
import Loading     from "../components/UI/Loading";
import ErrorMessage from "../components/UI/Error";
import { usePodcast } from "../context/PodcastContext";
import { genres }     from "../data";

import styles from "../styles/Home.module.css";

/**
 * Home page — podcast listing with search, filter, sort, and pagination.
 *
 * On mount checks if the user navigated back from ShowDetail and
 * restores their previous filter state if so.
 *
 * @returns {JSX.Element}
 */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, currentFilters, restoreFilters } = usePodcast();

  // Restore saved filters when returning from ShowDetail
  useEffect(() => {
    if (location.state?.filters) {
      restoreFilters(location.state.filters);
    }
  }, []);

  /**
   * Navigates to the show detail page.
   * Passes current filters through router state so they can be restored on back.
   * @param {string} id - Show ID
   */
  function handleShowClick(id) {
    navigate(`/show/${id}`, { state: { filters: currentFilters } });
  }

  if (loading) return <Loading message="Loading podcasts…" />;
  if (error)   return <ErrorMessage message={`Failed to load podcasts: ${error}`} />;

  return (
    <main>
      <div className={styles.controls}>
        <SearchBar />
        <div className={styles.filterRow}>
          <GenreFilter genres={genres} />
          <SortSelect />
        </div>
      </div>
      <PodcastGrid genres={genres} onShowClick={handleShowClick} />
      <Pagination />
    </main>
  );
}