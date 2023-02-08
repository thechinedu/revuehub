import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme({
  ".cm-content": {
    fontFamily: "Fira Code, ui-monospace, monospace",
  },
  ".cm-add-icon-container": {
    display: "inline-block",
    height: "16px",
    left: "-12px",
    position: "absolute",
    top: "1px",
    transitionDuration: "0.1s",
    verticalAlign: "middle",
    width: "16px",
    zIndex: "999",
  },
  ".cm-add-icon-container:hover": {
    transform: "scale(1.2)",
  },
});
