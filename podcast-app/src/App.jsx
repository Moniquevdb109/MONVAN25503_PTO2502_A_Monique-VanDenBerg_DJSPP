import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import { PodcastProvider } from "./context/PodcastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FavouritesProvider } from "./context/FavouritesContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import GlobalPlayer from "./components/UI/GlobalPlayer";
import Favourites from "./pages/Favourites";
import { ListeningProvider } from "./context/ListeningContext";

/**
 * App — root component of the application.
 * Sets up all global context providers and defines the route structure.
 *
 * Provider order (outermost to innermost):
 * - ThemeProvider: light/dark mode across the entire app
 * - FavouritesProvider: favourited episodes accessible everywhere
 * - ListeningProvider: listening progress accessible everywhere
 * - AudioPlayerProvider: global audio playback state
 * - PodcastProvider: podcast data, filtering, sorting, pagination
 *
 * GlobalPlayer is placed outside Routes so it persists across navigation.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
        <ListeningProvider>
        <AudioPlayerProvider>
          <Header />
          <PodcastProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/show/:id" element={<ShowDetail />} />
              <Route path="/favourites" element={<Favourites />} />
            </Routes>
          </PodcastProvider>
          <GlobalPlayer />
        </AudioPlayerProvider>
        </ListeningProvider>
      </FavouritesProvider>
    </ThemeProvider>
  );
}