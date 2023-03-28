import styles from "./CodeViewer.module.css";

export type AddCommentBoxProps = {
  value?: string;
  isSubmitDisabled?: boolean;
  commentLineReference?: string;
};

export const AddCommentBox = ({
  value = "",
  isSubmitDisabled = true,
  commentLineReference = "",
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
          <button className={styles.btn} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
