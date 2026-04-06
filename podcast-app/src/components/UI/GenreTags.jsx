import styles from "../../styles/GenreTags.module.css";

/**
 * Renders genre label strings as styled pill tags.
 * Used on the show detail page to display genre names.
 *
 * @param {{ labels: string[] }} props - Array of resolved genre title strings
 * @returns {JSX.Element}
 */
export default function GenreTags({ labels = [] }) {
  return (
    <div className={styles.tags}>
      {labels.map((label) => (
        <span key={label} className={styles.tag}>
          {label}
        </span>
      ))}
    </div>
  );
}