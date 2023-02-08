import styles from "./CodeViewer.module.css";

type AddCommentBoxProps = {
  value?: string;
};

export const AddCommentBox = ({
  value = "",
}: AddCommentBoxProps): JSX.Element => {
  return (
    <div className={styles.commentBox}>
      <form>
        <textarea placeholder="Write a comment" defaultValue={value} />

        <div className={styles.actions}>
          <label>
            <input type="checkbox" /> Comment applies to entire file
          </label>
          <button type="submit" className={styles.btn}>
            Add review comment
          </button>
          <button className={styles.btn}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
