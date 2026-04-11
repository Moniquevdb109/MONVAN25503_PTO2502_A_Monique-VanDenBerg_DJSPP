import { createContext, useContext, useEffect, useState } from "react";
import { fetchPodcasts } from "../api/fetchData";

/**
 * Sort options available in the SortSelect dropdown.
 * @type {{key: string, label: string}[]}
 */
export const SORT_OPTIONS = [
  { key: "default",    label: "Default"     },
  { key: "date-desc",  label: "Newest"      },
  { key: "date-asc",   label: "Oldest"      },
  { key: "title-asc",  label: "Title A → Z" },
  { key: "title-desc", label: "Title Z → A" },
];

/**
 * The context object — this is what components will read from.
 */
export const PodcastContext = createContext();

/**
 * Custom hook to consume PodcastContext cleanly.
 * Use this instead of useContext(PodcastContext) everywhere.
 *
 * @returns {Object} context value
 */
export function usePodcast() {
  return useContext(PodcastContext);
}

/**
 * PodcastProvider — wraps the app and provides shared state.
 * Fetches all podcast previews once on mount.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function PodcastProvider({ children }) {
  // ── Raw data state ──
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ── Filter / sort / search state ──
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("date-desc");
  const [genre,   setGenre]   = useState("all");

  // ── Pagination state ──
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all podcasts once when the app loads
  useEffect(() => {
    fetchPodcasts(setAllPodcasts, setError, setLoading);
  }, []);

  // Calculate how many cards fit on screen
  useEffect(() => {
    const calculate = () => {
      if (window.innerWidth <= 1024) {
        setPageSize(10);
        return;
      }
      const cols = Math.floor(window.innerWidth / 260);
      setPageSize(cols * 2);
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, sortKey, genre]);

  /**
   * Applies search, genre filter, and sort to the full podcast list.
   * @returns {Array} filtered and sorted podcasts
   */
  function applyFilters() {
    let data = [...allPodcasts];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (genre !== "all") {
      data = data.filter((p) => p.genres.includes(Number(genre)));
    }

    switch (sortKey) {
      case "title-asc":  data.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "title-desc": data.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "date-asc":   data.sort((a, b) => new Date(a.updated) - new Date(b.updated)); break;
      case "date-desc":  data.sort((a, b) => new Date(b.updated) - new Date(a.updated)); break;
      default: break;
    }

    return data;
  }

  // Run the filters and slice for current page
  const filtered    = applyFilters();
  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged       = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /**
   * Restores filter state when navigating back from a detail page.
   * @param {{ search?: string, sortKey?: string, genre?: string, page?: number }} filters
   */
  function restoreFilters(filters = {}) {
    if (filters.search  !== undefined) setSearch(filters.search);
    if (filters.sortKey !== undefined) setSortKey(filters.sortKey);
    if (filters.genre   !== undefined) setGenre(filters.genre);
    if (filters.page    !== undefined) setPage(filters.page);
  }

  // Everything components can read and use
  const value = {
    podcasts: paged,
    allPodcasts,
    loading,
    error,
    search,   setSearch,
    sortKey,  setSortKey,
    genre,    setGenre,
    page: currentPage,
    setPage,
    totalPages,
    currentFilters: { search, sortKey, genre, page: currentPage },
    restoreFilters,
  };

  return (
    <PodcastContext.Provider value={value}>
      {children}
    </PodcastContext.Provider>
  );
}