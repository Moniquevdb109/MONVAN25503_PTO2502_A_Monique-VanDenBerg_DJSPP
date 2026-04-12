import { createContext, useContext, useEffect, useRef, useState } from "react";

/**
 * @module AudioPlayerContext
 * Global audio player context. Manages a single Audio instance,
 * playback state, queue navigation, seek, and volume across all pages.
 */

const AudioPlayerContext = createContext();

/**
 * Custom hook to consume AudioPlayerContext.
 * Use this instead of useContext(AudioPlayerContext) everywhere.
 *
 * @returns {Object} Audio player context value.
 */
export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}

/**
 * AudioPlayerProvider — wraps the app and provides shared audio playback state.
 * Creates a single Audio instance via useRef so it persists across navigation.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [duration, setDuration]         = useState(0);
  const [volume, setVolume]             = useState(1);
  const [queue, setQueue]               = useState([]);
  const [queueIndex, setQueueIndex]     = useState(0);

    /**
   * Attaches audio event listeners on mount.
   * - timeupdate: keeps progress state in sync with audio currentTime
   * - loadedmetadata: sets duration once audio file is loaded
   * - ended: marks playback as stopped when episode finishes
   */
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

    /**
   * Shows a browser confirmation dialog if the user tries to
   * close or reload the page while audio is playing.
   */
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

    /**
   * Plays a track. If the same track is already loaded, resumes playback.
   * Otherwise sets a new audio source and loads it.
   * Optionally accepts a playlist array to enable next/prev navigation.
   * Resumes from startTime if provided (for listening progress feature).
   *
   * @param {Object}   track            - The track object to play.
   * @param {string}   track.id         - Unique track identifier.
   * @param {string}   track.file       - Audio file URL.
   * @param {string}   track.title      - Episode title.
   * @param {string}   track.showTitle  - Show name.
   * @param {string}   track.image      - Cover image URL.
   * @param {number}   [track.startTime] - Optional resume position in seconds.
   * @param {Object[]} [playlist=[]]    - Optional array of tracks for queue.
   */
  function play(track, playlist = []) {
    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      audio.play();
      setIsPlaying(true);
      return;
    }
    audio.src = track.file;
    audio.load();
    audio.addEventListener("loadedmetadata", () => {
      if (track.startTime) {
        audio.currentTime = track.startTime;
      }
      audio.play();
    }, { once: true });
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(track.startTime || 0);
    setDuration(0);

    if (playlist.length) {
      setQueue(playlist);
      setQueueIndex(playlist.findIndex((t) => t.id === track.id));
    }
  }

    /**
   * Pauses the current audio playback.
   */

  function pause() {
    audioRef.current.pause();
    setIsPlaying(false);
  }

    /**
   * Seeks to a specific position in the current track.
   * @param {number} time - Position in seconds to seek to.
   */
  function seek(time) {
    audioRef.current.currentTime = time;
    setProgress(time);
  }

    /**
   * Updates the audio volume.
   * @param {number} val - Volume level between 0 and 1.
   */
  function changeVolume(val) {
    audioRef.current.volume = val;
    setVolume(val);
  }

    /**
   * Plays the next track in the queue if one exists.
   */
  function playNext() {
    const nextIndex = queueIndex + 1;
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex);
      play(queue[nextIndex]);
    }
  }

    /**
   * Plays the previous track in the queue if one exists.
   */
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