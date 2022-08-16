import { cn } from "@/utils";
import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  label: string;
  value: number;
  barAmount?: number;
};

const PROGRESS_BAR_AMOUNT = 4; // This can be made a prop for the component if needed

const splitProgressValue = (value: number, barAmount: number): number[] => {
  const total = 100;
  const res = new Array(barAmount).fill(0);
  const subtractor = total / barAmount;

  if (value <= subtractor) {
    res[0] = value * barAmount;
    return res;
  }

  let ptr = 0;

  while (value > 0) {
    res[ptr] = value <= subtractor ? value * barAmount : subtractor * barAmount;

    value -= subtractor;
    ptr += 1;
  }

  return res;
};

const generateProgressBarColor = (value: number): string => {
  if (value < 26) return "redBar";
  if (value < 51) return "orangeBar";
  if (value < 76) return "blueBar";

  return "greenBar";
};

const Progress = ({ label, value }: ProgressBarProps): JSX.Element => {
  const progressBarSizes = splitProgressValue(value, PROGRESS_BAR_AMOUNT);
  const progressBarColor = generateProgressBarColor(value);

  return (
    <div className={styles.container}>
      {new Array(PROGRESS_BAR_AMOUNT).fill("").map((_item, idx) => {
        const width = progressBarSizes[idx];

        return (
          <div key={idx} className={styles.progressBarWrapper}>
            <div
              className={cn(styles, {
                progressBar: true,
                [progressBarColor]: true,
              })}
              style={{ width: `${width}%` }}
            />
          </div>
        );
      })}

      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default Progress;
