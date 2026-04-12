import { createContext, useContext, useEffect, useState } from "react";


/**
 * @module FavouritesContext
 * Global favourites context. Manages the list of favourited episodes
 * and persists them to localStorage across sessions.
 */

const FavouritesContext = createContext();

/**
 * Custom hook to consume FavouritesContext.
 * Use this instead of useContext(FavouritesContext) everywhere.
 *
 * @returns {Object} Favourites context value.
 */
export function useFavourites() {
  return useContext(FavouritesContext);
}

/**
 * FavouritesProvider — wraps the app and provides shared favourites state.
 * Initialises from localStorage on mount and syncs back on every change.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */

export function FavouritesProvider({ children }) {
    /**
   * Initialise favourites from localStorage.
   * Falls back to empty array if nothing is stored.
   */
  const [favourites, setFavourites] = useState(
    () => JSON.parse(localStorage.getItem("favourites")) || []
  );

    /**
   * Syncs favourites array to localStorage whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

    /**
   * Adds an episode to the favourites list.
   * Stamps the entry with the current date/time via addedAt.
   *
   * @param {Object} episode          - The episode object to favourite.
   * @param {string} episode.id       - Unique track identifier.
   * @param {string} episode.title    - Episode title.
   * @param {string} episode.showTitle - Show name.
   * @param {string} episode.image    - Cover image URL.
   * @param {string} episode.file     - Audio file URL.
   * @param {number} episode.season   - Season number.
   * @param {number} episode.episode  - Episode number.
   */
  function addFavourite(episode) {
    setFavourites((prev) => [
      ...prev,
      { ...episode, 
        season: episode.season,
        episode: episode.episode,
        addedAt: new Date().toISOString() },
    ]);
  }


  /**
   * Removes an episode from the favourites list by its ID.
   *
   * @param {string} episodeId - The unique ID of the episode to remove.
   */
  function removeFavourite(episodeId) {
    setFavourites((prev) => prev.filter((ep) => ep.id !== episodeId));
  }

    /**
   * Checks whether a specific episode is currently favourited.
   *
   * @param {string} episodeId - The unique ID of the episode to check.
   * @returns {boolean} True if the episode is in the favourites list.
   */
  function isFavourite(episodeId) {
    return favourites.some((ep) => ep.id === episodeId);
  }

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}