import styles from "./AddRepoDialog.module.css";

import {
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";

type AddRepoDialogProps = {
  isOpen: boolean;
};

export const AddRepoDialog = ({
  isOpen: readOnlyIsOpen,
}: AddRepoDialogProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(readOnlyIsOpen);

  const handleOpen = (open: boolean) => {
    // console.log({ open });
    // setIsOpen(open);
  };

  useEffect(() => {
    setIsOpen(readOnlyIsOpen);
  }, [readOnlyIsOpen]);

  return (
    <Root open>
      <Portal>
        <Overlay className={styles.overlay} />
        <Content className={styles.contentWrapper}>
          <section className={styles.content}>
            <Title className={styles.title}>Add thechinedu/revuehub</Title>
            <Description className={styles.description}>
              Import repository and invite reviewers
            </Description>

            <form className={styles.form}>
              <div className={styles.group}>
                <label htmlFor="branch" className={styles.label}>
                  Branch:
                </label>
                <input
                  type="text"
                  placeholder="main"
                  id="branch"
                  className={styles.input}
                  disabled
                />
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.btn}>
                  Add
                </button>
                <button className={styles.btn}>Cancel</button>
              </div>
            </form>
          </section>
        </Content>
      </Portal>
    </Root>
  );
};
