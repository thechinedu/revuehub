import styles from "./RepoSettings.module.css";

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

// import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/router";

import { FormEvent, useEffect, useState } from "react";

type AddReviewerDialogProps = {
  name: string;
  isOpen: boolean;
  onClose: () => void;
};

// const addRepo = (id: number) => post(`/repositories/${id}/contents`, {});

export const AddReviewerDialog = ({
  name,
  isOpen: readOnlyIsOpen,
  onClose,
}: AddReviewerDialogProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(readOnlyIsOpen);

  const router = useRouter();

  // const { mutate, isLoading, isError } = useMutation(() => addRepo(id), {
  //   onSuccess: () => {
  //     // TODO: redirect to repository page once it is added
  //     router.push("/dashboard");
  //   },
  // });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleAddReviewers = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log("inviting reviewers");
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
            <Title className={styles.title}>Add reviewers to {name}</Title>
            {/* <Description className={styles.description}>
              You are inviting reviewers to {name}. Reviewers will be able to
              leave comments on your code.
            </Description> */}

            <form className={styles.form} onSubmit={handleAddReviewers}>
              {/* <div className={styles.group}>
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
              </div> */}

              <UserSearch
                emptyMessage=" No reviewers selected yet"
                className={styles.group}
              />

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.btn}
                  // disabled={isLoading}
                >
                  {/* {isLoading ? "Loading..." : "Import repo"} */}
                  Invite reviewers
                </button>
              </div>

              {/* {isError && (
                <p className={styles.error}>
                  Failed to add repository to RevueHub. Please try again
                </p>
              )} */}
            </form>
          </section>
        </Content>
      </Portal>
    </Root>
  );
};
