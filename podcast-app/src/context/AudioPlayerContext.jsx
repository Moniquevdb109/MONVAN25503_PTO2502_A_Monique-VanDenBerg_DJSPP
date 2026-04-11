import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioPlayerContext = createContext();

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [duration, setDuration]         = useState(0);
  const [volume, setVolume]             = useState(1);
  const [queue, setQueue]               = useState([]);
  const [queueIndex, setQueueIndex]     = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate  = () => setProgress(audio.currentTime);
    const onLoaded      = () => setDuration(audio.duration);
    const onEnded       = () => setIsPlaying(false);

    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended",          onEnded);

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended",          onEnded);
    };
  }, []);

  useEffect(() => {
    const handleUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [isPlaying]);

  function play(track, playlist = []) {
    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      audio.play();
      setIsPlaying(true);
      return;
    }
    audio.src = track.file;
    audio.load();
    audio.play();
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);

    if (playlist.length) {
      setQueue(playlist);
      setQueueIndex(playlist.findIndex((t) => t.id === track.id));
    }
  }

  function pause() {
    audioRef.current.pause();
    setIsPlaying(false);
  }

  function seek(time) {
    audioRef.current.currentTime = time;
    setProgress(time);
  }

  function changeVolume(val) {
    audioRef.current.volume = val;
    setVolume(val);
  }

  function playNext() {
    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
      play(queue[nextIndex]);
    }
  }

  function playPrev() {
    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      setQueueIndex(prevIndex);
      play(queue[prevIndex]);
    }
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        queueIndex,
        play,
        pause,
        seek,
        changeVolume,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}