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

export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
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
      </FavouritesProvider>
    </ThemeProvider>
  );
}