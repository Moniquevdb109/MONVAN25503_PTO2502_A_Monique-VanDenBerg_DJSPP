import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import PodcastDetail from "../components/Podcasts/PodcastDetail";
import Loading from "../components/UI/Loading";
import ErrorMessage from "../components/UI/Error";
import { fetchSinglePodcast } from "../api/fetchData";
import { genres } from "../data";

/**
 * ShowDetail page.
 *
 * Reads the show ID from the URL parameter (:id) via useParams().
 * Example: URL is /show/9739 → id = "9739"
 *
 * Fetches the full show data (with seasons and episodes) from the API.
 * Handles loading, error, and empty states before rendering PodcastDetail.
 *
 * @returns {JSX.Element}
 */
export default function ShowDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

    /** Full podcast object including seasons and episodes */
  const [podcast, setPodcast] = useState(null);


  /** Whether the podcast data is currently being fetched */
  const [loading, setLoading] = useState(true);

    /** Error message string if the fetch fails */
  const [error,   setError]   = useState(null);

    /**
   * Fetches the full show data whenever the show ID in the URL changes.
   * Resets state before each fetch to avoid stale data being displayed.
   */

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPodcast(null);
    fetchSinglePodcast(id, setPodcast, setError, setLoading);
  }, [id]);

    /**
   * Navigates back to the home page.
   * Restores the user's previous filter state via router location state
   * so they return to the same search/filter/page they were on.
   */
  function handleBack() {
    navigate("/", { state: { filters: location.state?.filters ?? {} } });
  }

  if (loading) return <Loading message="Loading podcast…" />;

  if (error) {
    return (
      <div>
        <ErrorMessage message={`Error occurred while fetching podcast: ${error}`} />
        <button onClick={handleBack}>← Back to podcasts</button>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div>
        <ErrorMessage message="Show not found." />
        <button onClick={handleBack}>← Back to podcasts</button>
      </div>
    );
  }

  return (
    <PodcastDetail
      podcast={podcast}
      genres={genres}
      onBack={handleBack}
    />
  );
}