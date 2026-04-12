import { createContext, useContext, useEffect, useState } from "react";

/**
 * @module ListeningContext
 * Global listening progress context. Tracks playback position per episode,
 * marks episodes as finished, and persists history to localStorage.
 */

const ListeningContext = createContext();

/**
 * Custom hook to consume ListeningContext.
 * Use this instead of useContext(ListeningContext) everywhere.
 *
 * @returns {Object} Listening context value.
 */
export function useListening() {
  return useContext(ListeningContext);
}

/**
 * ListeningProvider — wraps the app and provides shared listening history state.
 * Initialises from localStorage on mount and syncs back on every change.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function ListeningProvider({ children }) {
    /**
   * Initialise listening history from localStorage.
   * History is an object keyed by trackId, each containing
   * currentTime, duration, finished, and updatedAt.
   */
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem("listeningHistory")) || {}
  );

    /**
   * Syncs listening history to localStorage whenever it changes.
   */

  useEffect(() => {
    localStorage.setItem("listeningHistory", JSON.stringify(history));
  }, [history]);

    /**
   * Saves the current playback position for a specific episode.
   * Automatically marks the episode as finished if 95% or more has been played.
   *
   * @param {string} trackId     - Unique identifier for the episode.
   * @param {number} currentTime - Current playback position in seconds.
   * @param {number} duration    - Total duration of the episode in seconds.
   */
  function saveProgress(trackId, currentTime, duration) {
    const finished = duration > 0 && currentTime / duration >= 0.95;
    setHistory((prev) => ({
      ...prev,
      [trackId]: {
        currentTime,
        duration,
        finished,
        updatedAt: new Date().toISOString(),
      },
    }));
  }


  /**
   * Retrieves the listening progress for a specific episode.
   *
   * @param {string} trackId - Unique identifier for the episode.
   * @returns {Object | null} Progress object or null if no history exists.
   */
  function getProgress(trackId) {
    return history[trackId] || null;
  }

    /**
   * Resets all listening history by clearing state and localStorage.
   */
  function resetHistory() {
    setHistory({});
    localStorage.removeItem("listeningHistory");
  }

  return (
    <ListeningContext.Provider
      value={{ history, saveProgress, getProgress, resetHistory }}
    >
      {children}
    </ListeningContext.Provider>
  );
}