import { EditorView } from "@codemirror/view";

export const getLineData = (lineElem: HTMLElement, view: EditorView) => {
  const editorTop = view.documentTop;
  const { top: lineELemTop } = lineElem.getBoundingClientRect();
  const lineElemPos = lineELemTop - editorTop;
  const lineElemBlockInfo = view.lineBlockAtHeight(lineElemPos);

  return view.state.doc.lineAt(lineElemBlockInfo.from);
};
