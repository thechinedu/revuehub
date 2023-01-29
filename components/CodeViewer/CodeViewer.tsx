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
import {
  Decoration,
  DecorationSet,
  EditorView,
  lineNumbers,
  ViewPlugin,
  WidgetType,
} from "@codemirror/view";

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

const eventHandlers = EditorView.domEventHandlers({
  mouseover: (evt, view) => {
    console.log(
      "mouse enter fired!",
      evt.target,
      (evt.target as HTMLDivElement).getBoundingClientRect()
    );
  },
});

class CommentBoxWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const button = document.createElement("button");
    button.textContent = "Add comment";

    return button;
  }
}

const commentBoxPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor() {
      const commentBoxDecoration = Decoration.widget({
        widget: new CommentBoxWidget(),
        // block: true,
      });
      this.decorations = Decoration.set([commentBoxDecoration.range(2)]);
    }
  },
  {
    decorations: (v) => v.decorations,
    eventHandlers: {},
  }
);

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
            eventHandlers,
            editorTheme,
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            javascript(),
            lineNumbers(),
            codeFolding(),
            foldGutter(),
            indentationMarkers(),
            commentBoxPlugin,
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
