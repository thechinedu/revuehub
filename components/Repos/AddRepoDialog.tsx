import styles from "./Repos.module.css";

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
    console.log({ open });
  };

  useEffect(() => {
    setIsOpen(readOnlyIsOpen);
  }, [readOnlyIsOpen]);

  return (
    <Root onOpenChange={handleOpen} open={isOpen}>
      <Portal>
        <Overlay className={styles.overlay} />
        <Content>
          <Title>Almost there. Add thechinedu/revuehub</Title>
          <Description>Import repository and invite reviewers</Description>

          <form>
            <label>
              Branch
              <input type="text" placeholder="main" disabled />
            </label>

            <button type="submit">Add</button>
          </form>
        </Content>
      </Portal>
    </Root>
  );
};
