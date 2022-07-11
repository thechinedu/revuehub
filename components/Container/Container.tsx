import styles from "./Container.module.css";

import { FC, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
