import styles from "./CodeViewer.module.css";

import { Comment, FetchAllCommentsResponse } from "@/types";
import { get } from "@/utils";

import { javascript } from "@codemirror/lang-javascript";
import {
  codeFolding,
  defaultHighlightStyle,
  foldGutter,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState, StateEffect } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";

import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { useQuery } from "@tanstack/react-query";

import { useEffect, useRef, useState } from "react";

import {
  CommentBoxContainer,
  CommentBox,
  CommentBoxMode,
  CommentBoxProps,
} from "./CommentBox";
import { editorTheme, eventHandlers } from "./extensions";
import { addCommentBoxCompartment, addCommentCompartment } from "./widgets";
import { multiLineCommentStore } from "./widgets/add-comment";
import {
  addCommentBoxStore,
  codeViewerStore,
  commentBoxDecorationSet,
} from "./widgets/add-comment-box";
import {
  lineHighlightCompartment,
  lineDecorationSet,
} from "./widgets/line-highlight";

const fetchAllComments = (repositoryID: number | undefined, filePath: string) =>
  get<FetchAllCommentsResponse>(
    `/comments?repository_id=${repositoryID}&file_path=${filePath}&view=code`
  );

type CodeViewerProps = {
  doc: string;
  filePath: string;
  className?: string;
  repositoryID?: number;
};

const commentToCommentBoxProperty = (comment: Comment): CommentBoxProps => {
  /**
   * value?: string | undefined;
    isSubmitDisabled?: boolean | undefined;
    commentLineReference?: string | undefined;
    mode?: CommentBoxMode | undefined;
    pos?: number | undefined;
   */
  return {
    value: comment.content,
    mode: CommentBoxMode.READ,
  };
};

const generateCommentBoxDecorations = (comments: Comment[]) => {
  for (const comment of comments) {
    addCommentBoxStore.add(comment.insertion_pos, [
      commentToCommentBoxProperty(comment),
    ]);
  }

  return addCommentBoxStore.generateDecorations();
};

const CodeViewer = ({
  doc,
  filePath,
  className = "",
  repositoryID,
}: CodeViewerProps): JSX.Element => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const showFileContents = Boolean(doc.length);
  console.log({ doc });

  const handleChange = () => setShowComments(!showComments);

  useQuery(
    ["getAllComments", filePath],
    () => fetchAllComments(repositoryID, filePath),
    {
      onSuccess: (comments) => {
        console.log(comments.data);
        setComments(comments.data);
      },
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: Boolean(repositoryID && filePath),
    }
  );

  useEffect(() => {
    if (!editorViewRef.current) {
      editorViewRef.current = new EditorView({
        state: EditorState.create({
          doc,
        }),
        parent: viewRef.current as HTMLDivElement,
      });
    }

    addCommentBoxStore.reset();

    const commentBoxExtension = generateCommentBoxDecorations(comments);

    const transaction = editorViewRef.current.state.update({
      changes: {
        from: 0,
        to: editorViewRef.current.state.doc.length,
        insert: doc.length ? doc : "no file selected",
      },
      effects: [
        filePath
          ? StateEffect.reconfigure.of([
              EditorView.editable.of(false),
              EditorView.lineWrapping,
              eventHandlers,
              editorTheme,
              syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
              javascript(),
              lineNumbers(),
              codeFolding(),
              foldGutter(),
              indentationMarkers(),
              addCommentCompartment.of([]),
              addCommentBoxCompartment.of(commentBoxExtension),
              lineHighlightCompartment.of([]),
            ])
          : StateEffect.reconfigure.of([EditorView.editable.of(false)]),
        addCommentCompartment.reconfigure([]),
        addCommentBoxCompartment.reconfigure(commentBoxExtension),
        lineHighlightCompartment.reconfigure([]),
      ],
    });

    console.log("effectual");
    multiLineCommentStore.reset();

    if (repositoryID) {
      codeViewerStore.set("repositoryID", repositoryID);
    }

    codeViewerStore.set("filePath", filePath);

    editorViewRef.current.dispatch(transaction);
  }, [doc, filePath, repositoryID]);

  useEffect(() => {
    if (!editorViewRef.current) return;

    if (showComments) {
      return;
    }
    const transaction = editorViewRef.current.state.update({
      effects: [addCommentBoxCompartment.reconfigure([])],
    });
    editorViewRef.current.dispatch(transaction);
  }, [showComments]);

  return (
    <>
      {/* {<AddCommentBox mode={CommentBoxMode.ADD} value="Hello comment box" />} */}
      {showFileContents && (
        <div className={styles.menu}>
          <p className={styles.filePath}>{filePath}</p>

          <label>
            <input
              type="checkbox"
              checked={showComments}
              onChange={handleChange}
            />{" "}
            Show comments
          </label>

          <button className={styles.fileCommentBtn}>
            Add file-level comment
          </button>
        </div>
      )}
      <div ref={viewRef} className={`${styles.container} ${className}`} />
    </>
  );
};

export default CodeViewer;
