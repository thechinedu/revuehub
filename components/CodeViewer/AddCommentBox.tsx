import styles from "./CodeViewer.module.css";

export type AddCommentBoxProps = {
  value?: string;
  isFileComment?: boolean;
  isSubmitDisabled?: boolean;
};

export const AddCommentBox = ({
  value = "",
  isFileComment = false,
  isSubmitDisabled = true,
}: AddCommentBoxProps): JSX.Element => {
  return (
    <div className={styles.commentBox}>
      <form>
        <textarea placeholder="Write a comment" defaultValue={value} />

        <div className={styles.actions}>
          <label>
            <input type="checkbox" defaultChecked={isFileComment} /> Comment
            applies to entire file
          </label>
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
