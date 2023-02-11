import styles from "./CodeViewer.module.css";

import { javascript } from "@codemirror/lang-javascript";
import {
  codeFolding,
  defaultHighlightStyle,
  foldGutter,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";

import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { useEffect, useRef } from "react";

import { editorTheme, eventHandlers } from "./extensions";
import { addCommentBoxCompartment, addCommentCompartment } from "./widgets";
import {
  addCommentBoxStore,
  commentBoxDecorationSet,
} from "./widgets/add-comment-box";
import { AddCommentBox } from "./AddCommentBox";

type CodeViewerProps = {
  doc: string;
  className?: string;
};

const CodeViewer = ({ doc, className = "" }: CodeViewerProps): JSX.Element => {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorViewRef.current) {
      editorViewRef.current = new EditorView({
        state: EditorState.create({
          doc,
          extensions: [
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
          ],
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
        addCommentCompartment.reconfigure([]),
        addCommentBoxCompartment.reconfigure([]),
      ],
    });

    addCommentBoxStore.reset();

    editorViewRef.current.dispatch(transaction);
  }, [doc]);

  return (
    <>
      {/* <AddCommentBox /> */}
      <div ref={viewRef} className={`${styles.container} ${className}`} />
    </>
  );
};

export default CodeViewer;
