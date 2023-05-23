import styles from "./CodeViewer.module.css";

import { PenIcon, TrashIcon } from "@/components/Icons";
import { Comment, CommentRequest, CreateCommentResponse } from "@/types";
import { cn, post } from "@/utils";

import { javascript } from "@codemirror/lang-javascript";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorView, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { commentToCommentBoxProperty } from "./CodeViewer";
import { destroy, patch } from "@/utils/request";

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
  repositoryID?: number;
  filePath?: string;
  parentCommentID?: number;
  level?: Comment["level"];
  insertionPos?: number;
  replies?: CommentBoxProps[];
  onSave?: (comment: CommentBoxProps, pos: number) => void;
  onCancel?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const saveCommentReply = (commentReqBody: CommentRequest) =>
  post<CommentRequest, CreateCommentResponse>("/comments", commentReqBody);

const updateComment = (commentID: number, content: string) =>
  patch<{ content: string }, CreateCommentResponse>(`/comments/${commentID}`, {
    content,
  });

const deleteComment = (commentID: number) => destroy(`/comments/${commentID}`);

export const CommentBox = ({
  id,
  value: readonlyValue = "",
  isSubmitDisabled: readonlyIsSubmitDisabled = true,
  commentLineReference = "",
  mode: readonlyMode = CommentBoxMode.ADD,
  pos,
  username,
  repositoryID,
  filePath,
  parentCommentID: parent_comment_id,
  level,
  snippet,
  startLine,
  endLine,
  insertionPos,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: CommentBoxProps): JSX.Element => {
  const [commentBoxProperties, setCommentBoxProperties] = useState({
    value: readonlyValue,
    isSubmitDisabled: readonlyIsSubmitDisabled,
    mode: readonlyMode,
  });
  const { value, isSubmitDisabled, mode } = commentBoxProperties;

  useEffect(() => {
    setCommentBoxProperties({
      ...commentBoxProperties,
      mode: readonlyMode,
    });
  }, [readonlyMode]);

  const handleCreate = () => {
    return saveCommentReply({
      content: value,
      repository_id: repositoryID as number,
      file_path: filePath as string,
      level: level as unknown as CommentRequest["level"],
      parent_comment_id,
      snippet,
      start_line: startLine,
      end_line: endLine,
      insertion_pos: insertionPos,
    });
  };

  const handleUpdate = () => {
    return updateComment(id, value);
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    const submitOperationForMode: Record<
      CommentBoxMode.ADD | CommentBoxMode.EDIT,
      () => Promise<CreateCommentResponse>
    > = {
      [CommentBoxMode.ADD]: handleCreate,
      [CommentBoxMode.EDIT]: handleUpdate,
    };

    try {
      const commentRes = await submitOperationForMode[
        mode as CommentBoxMode.ADD | CommentBoxMode.EDIT
      ]();
      const comment = commentToCommentBoxProperty(commentRes.data);

      onSave?.(comment, pos as number);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = evt.target;
    setCommentBoxProperties({
      ...commentBoxProperties,
      value,
      isSubmitDisabled: value.trim().length === 0,
    });
  };

  const handleEdit = () => {
    setCommentBoxProperties({
      ...commentBoxProperties,
      isSubmitDisabled: false,
      mode: CommentBoxMode.EDIT,
    });

    onEdit?.(id);
  };

  const handleDelete = () => {
    try {
      const shouldDelete = confirm(
        "Are you sure you want to delete this comment?"
      );

      if (shouldDelete === false) return;

      deleteComment(id);
      onDelete?.(id);
    } catch (err) {
      console.error(err);
    }
  };

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
              <button className={styles.iconWrapper} onClick={handleEdit}>
                <PenIcon className={styles.icon} />
              </button>
              <button className={styles.iconWrapper} onClick={handleDelete}>
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
          <form data-elem-pos={pos} onSubmit={handleSubmit}>
            <textarea
              placeholder="Write a comment"
              value={value}
              data-elem-pos={pos}
              onChange={handleChange}
              autoFocus
            />

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.btn}
                disabled={isSubmitDisabled}
              >
                {mode === CommentBoxMode.ADD
                  ? "Add review comment"
                  : "Update comment"}
              </button>
              <button
                className={styles.btn}
                type="button"
                data-action="reset"
                data-elem-pos={pos}
                onClick={() => onCancel?.(id)}
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
  repositoryID?: number;
  filePath?: string;
};

export const CommentBoxContainer = ({
  comments: readonlyComments = [],
  mode = CommentBoxMode.READ,
  filePath,
  repositoryID,
}: CommentBoxContainerProps) => {
  const [comments, setComments] = useState<CommentBoxProps[]>(readonlyComments);
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

  useEffect(() => {
    setComments(readonlyComments);
  }, [readonlyComments]);

  const handleReply = () => {
    const newComment: CommentBoxProps = {
      ...mainComment,
      id: 0,
      isSubmitDisabled: true,
      commentLineReference: "",
      value: "",
      mode: CommentBoxMode.ADD,
    };

    setComments([...comments, newComment]);
  };

  const handleSave = (comment: CommentBoxProps, pos: number) => {
    const newComments = [...comments];
    newComments[pos] = comment;

    setComments(newComments);
  };

  const handleCancel = (id: number) => {
    const newComments = [];

    for (const [idx, comment] of comments.entries()) {
      if (comment.mode === CommentBoxMode.EDIT && comment.id === id) {
        comment.mode = CommentBoxMode.READ;
        newComments.push(comment);
        continue;
      }

      if (comment.mode === CommentBoxMode.ADD) {
        continue;
      }

      newComments.push(comment);
    }

    setComments(newComments);
  };

  const handleEdit = (id: number) => {
    const newComments = comments.map((comment) => {
      if (comment.id === id) {
        comment.mode = CommentBoxMode.EDIT;
      }

      return comment;
    });

    setComments(newComments);
  };

  const handleDelete = (id: number) => {
    const newComments = comments.filter((comment) => comment.id !== id);
    setComments(newComments);
  };

  const hideReplyBox = comments.find(
    (comment) => comment.mode === CommentBoxMode.ADD
  );

  if (comments.length === 0) return null;

  return (
    <div
      className={cn(styles, {
        commentBoxContainer: true,
        readMode: mode === CommentBoxMode.READ,
      })}
    >
      <div ref={viewRef} className={styles.codeViewer} />

      {comments.map((comment, idx) => (
        <CommentBox
          key={comment.id}
          pos={idx}
          parentCommentID={mainComment.id}
          repositoryID={repositoryID}
          filePath={filePath}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onDelete={handleDelete}
          {...comment}
        />
      ))}

      <div className={styles.replyCommentWrapper}>
        {!hideReplyBox && (
          <input
            type="text"
            placeholder="Reply..."
            className={styles.replyComment}
            onClick={handleReply}
          />
        )}
      </div>
    </div>
  );
};
