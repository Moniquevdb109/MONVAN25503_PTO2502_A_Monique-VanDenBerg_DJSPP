import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import { PodcastProvider } from "./context/PodcastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FavouritesProvider } from "./context/FavouritesContext";

export default function App() {
  return (
    <ThemeProvider>
      <FavouritesProvider>
      <Header />
      <PodcastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
        </Routes>
      </PodcastProvider>
      </FavouritesProvider>
    </ThemeProvider>
  );
}