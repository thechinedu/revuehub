import styles from "./Container.module.css";

import { FC, ReactNode, HTMLProps } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>;

const Container: FC<ContainerProps> = ({
  children,
  className = "",
  ...restProps
}) => {
  const containerClassName = `${styles.container} ${className}`.trim();
  return (
    <div className={containerClassName} {...restProps}>
      {children}
    </div>
  );
};

export default Container;
