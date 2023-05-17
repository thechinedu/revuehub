import styles from "./CodeViewer.module.css";

import { PenIcon, TrashIcon } from "@/components/Icons";
import { cn } from "@/utils";

import { javascript } from "@codemirror/lang-javascript";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorView, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

import Image from "next/image";
import { useEffect, useRef } from "react";

export enum CommentBoxMode {
  ADD,
  EDIT,
  READ,
}

export type CommentBoxProps = {
  id: number;
  value?: string;
  isSubmitDisabled?: boolean;
  commentLineReference?: string;
  mode?: CommentBoxMode;
  pos?: number;
  username?: string;
  snippet?: string;
  startLine?: number;
  endLine?: number;
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
  mode?: CommentBoxMode;
};

export const CommentBoxContainer = ({
  comments = [],
  mode = CommentBoxMode.READ,
}: CommentBoxContainerProps) => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const mainComment = comments[0];

  useEffect(() => {
    if (!editorViewRef.current) {
      editorViewRef.current = new EditorView({
        state: EditorState.create({
          doc: mainComment.snippet || "",
          extensions: [
            EditorView.editable.of(false),
            lineNumbers({
              formatNumber: (n) => `${n - 1 + (mainComment?.startLine || 1)} `,
            }),
            javascript(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          ],
        }),
        parent: viewRef.current as HTMLDivElement,
      });
    }
  }, []);

  const hideReplyBox = comments.find(
    (comment) => comment.mode === CommentBoxMode.ADD
  );

  return (
    <div
      className={cn(styles, {
        commentBoxContainer: true,
        readMode: mode === CommentBoxMode.READ,
      })}
    >
      <div ref={viewRef} className={styles.codeViewer} />

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
// Add support for retrieving all comments ✅
// Add support for updating comments (clicking cancel should only dismiss the comment box being edited)
// Add support for deleting comments
