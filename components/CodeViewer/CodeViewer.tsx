import styles from "./CodeViewer.module.css";

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

import { useEffect, useRef } from "react";

import { editorTheme, eventHandlers } from "./extensions";
import { addCommentBoxCompartment, addCommentCompartment } from "./widgets";
import {
  addCommentBoxStore,
  codeViewerStore,
  commentBoxDecorationSet,
} from "./widgets/add-comment-box";
import { CommentBoxContainer, CommentBox, CommentBoxMode } from "./CommentBox";
import { multiLineCommentStore } from "./widgets/add-comment";
import {
  lineHighlightCompartment,
  lineDecorationSet,
} from "./widgets/line-highlight";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils";

const fetchAllComments = (repositoryID: number | undefined, filePath: string) =>
  get(
    `/comments?repository_id=${repositoryID}&file_path=${filePath}&view=code`
  );

type CodeViewerProps = {
  doc: string;
  filePath: string;
  className?: string;
  repositoryID?: number;
};

const CodeViewer = ({
  doc,
  filePath,
  className = "",
  repositoryID,
}: CodeViewerProps): JSX.Element => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useQuery(
    ["getAllComments", filePath],
    () => fetchAllComments(repositoryID, filePath),
    {
      onSuccess: (data) => {
        console.log(data, "hello");
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

    const transaction = editorViewRef.current.state.update({
      changes: {
        from: 0,
        to: editorViewRef.current.state.doc.length,
        insert: doc,
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
              addCommentBoxCompartment.of([]),
              lineHighlightCompartment.of([]),
            ])
          : StateEffect.reconfigure.of([EditorView.editable.of(false)]),
        addCommentCompartment.reconfigure([]),
        addCommentBoxCompartment.reconfigure([]),
        lineHighlightCompartment.reconfigure([]),
      ],
    });

    addCommentBoxStore.reset();
    multiLineCommentStore.reset();

    if (repositoryID) {
      codeViewerStore.set("repositoryID", repositoryID);
    }

    codeViewerStore.set("filePath", filePath);

    editorViewRef.current.dispatch(transaction);
  }, [doc, filePath, repositoryID]);

  return (
    <>
      {/* {<AddCommentBox mode={CommentBoxMode.ADD} value="Hello comment box" />} */}
      <div ref={viewRef} className={`${styles.container} ${className}`} />
    </>
  );
};

export default CodeViewer;
