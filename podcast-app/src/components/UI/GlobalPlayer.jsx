import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { useListening } from "../../context/ListeningContext";
import styles from "../../styles/GlobalPlayer.module.css";
import { useEffect } from "react";

/**
 * Formats a time value in seconds to a human-readable mm:ss string.
 * @param {number} seconds - Time in seconds to format.
 * @returns {string} Formatted time string e.g. "2:45".
 */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * GlobalPlayer — fixed audio player bar rendered at the bottom of every page.
 * Provides play/pause, skip, seek, and volume controls.
 * Saves listening progress to context every 5 seconds and on pause.
 * Returns null if no track is currently loaded.
 *
 * @returns {JSX.Element | null}
 */
export default function GlobalPlayer() {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, play, pause, seek, changeVolume,
    playNext, playPrev, queue, queueIndex,
  } = useAudioPlayer();

   const { saveProgress } = useListening();

  /**
   * Saves playback progress every 5 seconds while audio is playing.
   * Clears the interval when playback stops or the track changes.
   */
  useEffect(() => {
    if (!currentTrack || !isPlaying) return;
    const interval = setInterval(() => {
      saveProgress(currentTrack.id, progress, duration);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying, progress, duration]);

  /**
   * Saves playback progress whenever the audio is paused.
   * Ensures position is stored even if the 5-second interval hasn't fired.
   */
  useEffect(() => {
    if (!currentTrack || isPlaying) return;
    saveProgress(currentTrack.id, progress, duration);
  }, [isPlaying]);

  if (!currentTrack) return null;

  return (
    <div className={styles.player}>
      <div className={styles.trackInfo}>
        <img src={currentTrack.image} alt={currentTrack.title} className={styles.cover} />
        <div className={styles.titles}>
          <span className={styles.episodeTitle}>{currentTrack.title}</span>
          <span className={styles.showTitle}>{currentTrack.showTitle}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.skipBtn}
          onClick={playPrev}
          disabled={queueIndex === 0}
          aria-label="Previous"
        >
          ⏮
        </button>
        <button
          className={styles.playBtn}
          onClick={() => (isPlaying ? pause() : play(currentTrack))}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
          className={styles.skipBtn}
          onClick={playNext}
          disabled={queueIndex === queue.length - 1}
          aria-label="Next"
        >
          ⏭
        </button>

        <span className={styles.time}>{formatTime(progress)}</span>
        <input
          type="range"
          className={styles.seekBar}
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>

      <div className={styles.volume}>
        <span className={styles.volumeIcon}>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className={styles.volumeBar}
        />
      </div>
    </div>
  );
}