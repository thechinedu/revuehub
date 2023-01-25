import styles from "./CodeViewer.module.css";

import { cn } from "@/utils";

import { javascript } from "@codemirror/lang-javascript";
import {
  codeFolding,
  defaultHighlightStyle,
  foldGutter,
  language,
  syntaxHighlighting,
} from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";

import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { useEffect, useRef } from "react";

type CodeViewerProps = {
  doc: string;
  className?: string;
};

const editorTheme = EditorView.theme({
  ".cm-content": {
    fontFamily: "Fira Code, ui-monospace, monospace",
  },
});

const languageConf = new Compartment();

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
            editorTheme,
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

  return <div ref={viewRef} className={`${styles.container} ${className}`} />;
};

export default CodeViewer;
