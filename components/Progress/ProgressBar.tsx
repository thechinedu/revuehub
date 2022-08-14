import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  label: string;
  value: number;
};

const Progress = ({ label, value }: ProgressBarProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} />
      </div>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} />
      </div>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} />
      </div>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} />
      </div>
    </div>
  );
};

export default Progress;
