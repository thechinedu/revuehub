import styles from "./CodeViewer.module.css";

import { PenIcon, TrashIcon } from "@/components/Icons";
import { cn } from "@/utils";

import Image from "next/image";

export enum CommentBoxMode {
  ADD,
  EDIT,
  READ,
}

export type CommentBoxProps = {
  value?: string;
  isSubmitDisabled?: boolean;
  commentLineReference?: string;
  mode?: CommentBoxMode;
  pos?: number;
};

export const CommentBox = ({
  value = "",
  isSubmitDisabled = true,
  commentLineReference = "",
  mode = CommentBoxMode.ADD,
  pos,
}: CommentBoxProps): JSX.Element => {
  return (
    <div
      className={cn(styles, {
        commentBox: true,
        readMode: mode === CommentBoxMode.READ,
      })}
    >
      {mode === CommentBoxMode.READ && (
        <div>
          <div className={styles.metadata}>
            <Image
              src="https://placebeard.it/16/16/notag"
              alt=""
              width={16}
              height={16}
            />
            <p className={styles.username}>thechinedu</p>

            <div className={styles.actions}>
              <button className={styles.iconWrapper}>
                <PenIcon className={styles.icon} />
              </button>
              <button className={styles.iconWrapper}>
                <TrashIcon
                  className={cn(styles, {
                    icon: true,
                    deleteIcon: true,
                  })}
                />
              </button>
            </div>
          </div>

          <p className={styles.comment}>{value}</p>
        </div>
      )}
      {mode !== CommentBoxMode.READ && (
        <>
          <p>{commentLineReference}</p>
          <form data-elem-pos={pos}>
            <textarea
              placeholder="Write a comment"
              defaultValue={value}
              data-elem-pos={pos}
            />

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.btn}
                disabled={isSubmitDisabled}
              >
                Add review comment
              </button>
              <button className={styles.btn} type="button" data-action="reset">
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

type CommentBoxContainerProps = {
  comments: CommentBoxProps[];
};

export const CommentBoxContainer = ({
  comments = [],
}: CommentBoxContainerProps) => {
  return (
    <div className={styles.commentBoxContainer}>
      {comments.map((comment, idx) => (
        <CommentBox key={idx} pos={idx} {...comment} />
      ))}

      <div className={styles.replyCommentWrapper}>
        {comments[0]?.mode !== CommentBoxMode.ADD && (
          <input
            type="text"
            placeholder="Reply..."
            className={styles.replyComment}
          />
        )}
        {/* <CommentBox /> */}
      </div>
    </div>
  );
};

// Rename AddCommentBox to CommentBox
// The CommentBox children will take a prop representing the mode they are in { value, isSubmitDisabled, commentLineReference, mode }
//        CommentBox will have a child component that can be in one of three modes: add, read or edit
// CommentBox should take a prop representing the comments that are associated with it
// CommentBox should render a AddCommentBox in add mode if there are no comments
//        CommentBox should render all CommentBoxes in read mode if there are comments
