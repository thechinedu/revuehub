import styles from "./CodeViewer.module.css";

import { EditorView } from "@codemirror/view";

import { LegacyRef, useEffect, useRef } from "react";

const CodeViewer = () => {
  const viewRef = useRef();

  useEffect(() => {
    new EditorView({
      doc: "Hello world",
      extensions: [EditorView.editable.of(false)],
      parent: viewRef.current,
    });
  }, []);

  return (
    <div ref={viewRef as unknown as LegacyRef<HTMLDivElement> | undefined} />
  );
};

export default CodeViewer;
