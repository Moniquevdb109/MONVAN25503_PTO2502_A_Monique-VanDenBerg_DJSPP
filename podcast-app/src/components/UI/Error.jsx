import styles from "../../styles/Error.module.css";

/**
 * Reusable error message display.
 *
 * @param {{ message: string }} props
 * @returns {JSX.Element}
 */
export default function ErrorMessage({ message }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>⚠️ {message}</p>
    </div>
  );
}