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

import { LegacyRef, useEffect, useRef } from "react";

type CodeViewerProps = {
  doc: string;
};

const CodeViewer = ({ doc }: CodeViewerProps): JSX.Element => {
  const viewRef = useRef();

  // DEV only
  // const renderCount = useRef(0);
  // useEffect(() => {
  //   // TODO: ReactStrictMode causes effects to be called twice on render.
  //   // remove before deploying to prod as check is not needed in non-dev environments
  //   if (renderCount.current > 0) return;

  //   renderCount.current += 1;

  // new EditorView({
  //   state: EditorState.create({
  //     doc,
  //     extensions: [
  //       EditorView.editable.of(false),
  //       EditorView.lineWrapping,
  //       syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  //       javascript(),
  //       lineNumbers(),
  //       codeFolding(),
  //       foldGutter(),
  //       indentationMarkers(),
  //     ],
  //   }),
  //   parent: viewRef.current,
  // });
  // }, [doc]);

  // Prod
  useEffect(() => {
    new EditorView({
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
      parent: viewRef.current,
    });
  }, [doc]);

  return (
    <div ref={viewRef as unknown as LegacyRef<HTMLDivElement> | undefined} />
  );
};

export default CodeViewer;
