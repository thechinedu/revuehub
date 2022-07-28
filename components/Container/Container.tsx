import styles from "./Container.module.css";

import { cn } from "@/utils";

import { FC, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: FC<ContainerProps> = ({ children, className = "" }) => {
  const containerClassName = `${styles.container} ${className}`.trim();
  return <div className={containerClassName}>{children}</div>;
};

export default Container;
