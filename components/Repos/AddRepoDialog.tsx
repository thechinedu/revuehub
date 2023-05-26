import styles from "./AddRepoDialog.module.css";

import { CloseIcon } from "@/components/Icons";
import UserSearch from "@/components/UserSearch";

import { post } from "@/utils";

import {
  Content,
  Close,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from "@radix-ui/react-dialog";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/router";

import { FormEvent, useEffect, useState } from "react";

type AddRepoDialogProps = {
  id: number;
  name: string;
  isOpen: boolean;
  onClose: () => void;
};

const addRepo = (id: number) => post(`/repositories/${id}/contents`, {});

export const AddRepoDialog = ({
  id,
  name,
  isOpen: readOnlyIsOpen,
  onClose,
}: AddRepoDialogProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(readOnlyIsOpen);

  const router = useRouter();

  const { mutate, isLoading, isError } = useMutation(() => addRepo(id), {
    onSuccess: () => {
      // TODO: redirect to repository page once it is added
      router.push("/dashboard");
    },
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleAddRepo = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    mutate();
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
            <Title className={styles.title}>Add {name}</Title>
            <Description className={styles.description}>
              Import repository and invite reviewers
            </Description>

            <form className={styles.form} onSubmit={handleAddRepo}>
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

              <UserSearch
                emptyMessage=" No reviewers selected yet. Reviewers can also be added after importing
          your repository"
                className={styles.group}
              />

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.btn}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Import repo"}
                  {/* and invite reviewers */}
                </button>
              </div>

              {isError && (
                <p className={styles.error}>
                  Failed to add repository to RevueHub. Please try again
                </p>
              )}
            </form>
          </section>
        </Content>
      </Portal>
    </Root>
  );
};
