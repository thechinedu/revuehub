import styles from "./CodeViewer.module.css";

import { Comment, FetchAllCommentsResponse } from "@/types";
import { cn, get } from "@/utils";

import { javascript } from "@codemirror/lang-javascript";
import {
  codeFolding,
  defaultHighlightStyle,
  foldGutter,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { DecorationSet, EditorView, lineNumbers } from "@codemirror/view";

import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { useQuery } from "@tanstack/react-query";

import { ChangeEvent, useEffect, useRef, useState } from "react";

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
    id: comment.id,
    value: comment.content,
    mode: CommentBoxMode.READ,
    snippet: comment.snippet,
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
  const [comments, setComments] = useState<CommentBoxProps[]>([]);
  const [showComments, setShowComments] = useState(true);
  const showCommentsContainerRef = useRef<HTMLInputElement | null>(null);

  const showFileContents = Boolean(doc.length);

  codeViewerStore.set("comments", comments);
  codeViewerStore.set("updateComments", setComments);

  useQuery(
    ["getAllComments", filePath],
    () => fetchAllComments(repositoryID, filePath),
    {
      onSuccess: (comments) => {
        console.log(comments.data);
        setComments(comments.data.map(commentToCommentBoxProperty));
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

    const commentBoxExtension = generateCommentBoxDecorations([]);

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

  return (
    <div
      className={cn(styles, {
        mainContainer: true,
        showFileContents,
        showComments,
      })}
    >
      <div className={cn(styles, { menu: true, isShowing: showFileContents })}>
        <p className={styles.filePath}>{filePath}</p>

        <label>
          <input
            type="checkbox"
            checked={showComments}
            onChange={(evt: ChangeEvent<HTMLInputElement>) => {
              setShowComments(evt.target.checked);
            }}
          />{" "}
          Show comments
        </label>

        <button className={styles.fileCommentBtn}>
          Add file-level comment
        </button>
      </div>

      <div
        ref={viewRef}
        className={`${styles.codeViewContainer} ${className}`}
      />

      <div
        className={cn(styles, {
          commentsContainer: true,
          isShowing: showFileContents && showComments,
        })}
      >
        {comments.length === 0 && (
          <p className={styles.noComments}>
            There are no comments on this file
          </p>
        )}
        {comments.map((comment) => {
          return <CommentBoxContainer key={comment.id} comments={[comment]} />;
        })}
      </div>
    </div>
  );
};

export default CodeViewer;
