import styles from "../../styles/Loading.module.css";

/**
 * Reusable loading spinner with a message.
 * @param {{ message?: string }} props
 * @returns {JSX.Element}
 */
export default function Loading({ message = "Loading…" }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-label="Loading" />
      <p>{message}</p>
    </div>
  );
}