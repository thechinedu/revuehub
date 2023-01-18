import styles from "./Container.module.css";

import { ReactNode, HTMLProps } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>;

const Container = ({
  children,
  className = "",
  ...restProps
}: ContainerProps): JSX.Element => {
  const containerClassName = `${styles.container} ${className}`.trim();
  return (
    <div className={containerClassName} {...restProps}>
      {children}
    </div>
  );
};

export default Container;
