import { createContext, useContext, useEffect, useState } from "react";

const ListeningContext = createContext();

export function useListening() {
  return useContext(ListeningContext);
}

export function ListeningProvider({ children }) {
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem("listeningHistory")) || {}
  );

  useEffect(() => {
    localStorage.setItem("listeningHistory", JSON.stringify(history));
  }, [history]);

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

  function getProgress(trackId) {
    return history[trackId] || null;
  }

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