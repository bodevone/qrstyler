import styles from "@/styles/loading-dots.module.css"

export const LoadingDots = () => {
  const color = "white"
  return (
    <span className={styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};
