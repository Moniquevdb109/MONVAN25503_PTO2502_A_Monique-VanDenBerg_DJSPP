/**
 * @module fetchData
 * Centralised API helpers. All network calls go through this file.
 */

const BASE_URL = "https://podcast-api.netlify.app";

/**
 * Fetches all podcast previews from the API.
 *
 * @param {Function} setPodcasts - State setter for the array of podcast preview objects.
 * @param {Function} setError - State setter for the error message string.
 * @param {Function} setLoading - State setter for the boolean loading flag.
 * @returns {Promise<void>}
 */
export async function fetchPodcasts(setPodcasts, setError, setLoading) {
  try {
    const res = await fetch(`${BASE_URL}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setPodcasts(data);
  } catch (err) {
    console.error("Failed to fetch podcasts:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/**
 * Fetches a single podcast show by ID.
 * The returned object contains embedded seasons and episodes.
 *
 * @param {string}   id  - The unique ID of the podcast show to fetch.
 * @param {Function} setPodcast - State setter for the podcast show object.
 * @param {Function} setError  - State setter for the error message string.
 * @param {Function} setLoading - State setter for the boolean loading flag.
 * @returns {Promise<void>}
 */
export async function fetchSinglePodcast(id, setPodcast, setError, setLoading) {
  try {
    const res = await fetch(`${BASE_URL}/id/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setPodcast(data);
  } catch (err) {
    console.error("Failed to fetch show:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}