import styles from "./CodeViewer.module.css";

export type AddCommentBoxProps = {
  value?: string;
  isSubmitDisabled?: boolean;
  commentLineReference?: string;
  mode?: "add" | "edit" | "read" | "reply";
};

export const AddCommentBox = ({
  value = "",
  isSubmitDisabled = true,
  commentLineReference = "",
  mode = "add",
}: AddCommentBoxProps): JSX.Element => {
  return (
    <div className={styles.commentBox}>
      <p>{commentLineReference}</p>
      <form>
        <textarea placeholder="Write a comment" defaultValue={value} />

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
    </div>
  );
};

// Rename AddCommentBox to CommentBox
// The CommentBox children will take a prop representing the mode they are in { value, isSubmitDisabled, commentLineReference, mode }
//        CommentBox will have a child component that can be in one of three modes: add, read or edit
// CommentBox should take a prop representing the comments that are associated with it
// CommentBox should render a AddCommentBox in add mode if there are no comments
//        CommentBox should render all CommentBoxes in read mode if there are comments
