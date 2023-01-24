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

type CodeViewerProps = {
  doc: string;
};

const CodeViewer = ({ doc }: CodeViewerProps): JSX.Element => {
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
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            javascript(),
            lineNumbers(),
            codeFolding(),
            foldGutter(),
            indentationMarkers(),
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
    });

    editorViewRef.current.dispatch(transaction);
  }, [doc]);

  return <div ref={viewRef} />;
};

export default CodeViewer;
