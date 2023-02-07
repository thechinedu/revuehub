import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme({
  ".cm-content": {
    fontFamily: "Fira Code, ui-monospace, monospace",
  },
  ".cm-add-icon-container": {
    display: "inline-block",
    height: "16px",
    verticalAlign: "middle",
    width: "16px",
  },
});
