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
  username?: string;
};

export const CommentBox = ({
  value = "",
  isSubmitDisabled = true,
  commentLineReference = "",
  mode = CommentBoxMode.ADD,
  pos,
  username,
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
            <p className={styles.username}>{username}</p>

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
              autoFocus
            />

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.btn}
                disabled={isSubmitDisabled}
              >
                Add review comment
              </button>
              <button
                className={styles.btn}
                type="button"
                data-action="reset"
                data-elem-pos={pos}
              >
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
  const hideReplyBox = comments.find(
    (comment) => comment.mode === CommentBoxMode.ADD
  );

  return (
    <div className={styles.commentBoxContainer}>
      {comments.map((comment, idx) => (
        <CommentBox key={idx} pos={idx} {...comment} />
      ))}

      <div className={styles.replyCommentWrapper}>
        {!hideReplyBox && (
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

// @Next::TODO
// Clicking cancel on the comment box should only dismiss the specific comment box and not the entire comment box container ✅
// Add support for retrieving all comments
// Add support for updating comments (clicking cancel should only dismiss the comment box being edited)
// Add support for deleting comments
