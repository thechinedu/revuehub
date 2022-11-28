import styles from "./AddRepoDialog.module.css";

import { CloseIcon } from "@/components/Icons";

import {
  Content,
  Close,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";

type AddRepoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddRepoDialog = ({
  isOpen: readOnlyIsOpen,
  onClose,
}: AddRepoDialogProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(readOnlyIsOpen);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    setIsOpen(readOnlyIsOpen);
  }, [readOnlyIsOpen]);

  return (
    <Root open={isOpen} onOpenChange={handleOnOpenChange}>
      <Portal>
        <Overlay className={styles.overlay} />
        <Content className={styles.contentWrapper}>
          <section className={styles.content}>
            <Close
              className={styles.closeIconBtn}
              aria-label="Close dialog"
              onClick={handleClose}
            >
              <CloseIcon className={styles.closeIcon} />
            </Close>
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

              <div className={styles.group}>
                <label htmlFor="reviewer" className={styles.label}>
                  Search and add reviewers:
                </label>
                <input
                  type="text"
                  placeholder="Search by username or email"
                  id="reviewer"
                  className={styles.input}
                />

                <div className={styles.reviewers}>
                  <p>
                    No reviewers selected yet. Reviewers can also be added after
                    importing your repository
                  </p>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.btn}>
                  Import repo
                  {/* and invite reviewers */}
                </button>
              </div>
            </form>
          </section>
        </Content>
      </Portal>
    </Root>
  );
};
