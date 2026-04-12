import { createContext, useContext, useEffect, useState } from "react";

const FavouritesContext = createContext();

export function useFavourites() {
  return useContext(FavouritesContext);
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(
    () => JSON.parse(localStorage.getItem("favourites")) || []
  );

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  function addFavourite(episode) {
    setFavourites((prev) => [
      ...prev,
      { ...episode, 
        season: episode.season,
        episode: episode.episode,
        addedAt: new Date().toISOString() },
    ]);
  }

  function removeFavourite(episodeId) {
    setFavourites((prev) => prev.filter((ep) => ep.id !== episodeId));
  }

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