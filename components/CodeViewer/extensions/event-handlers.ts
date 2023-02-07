import { EditorView } from "@codemirror/view";

import { getLineElem } from "../helpers/get-line-elem";
import { addCommentCompartment, addCommentPlugin } from "../widgets";

export const eventHandlers = EditorView.domEventHandlers({
  mouseover: (evt, view) => {
    const elem = evt.target as HTMLElement;

    if (elem.classList.contains("cm-content")) return;

    const editorTop = view.documentTop;
    const lineElem = getLineElem(elem);
    const { top: lineELemTop } = lineElem.getBoundingClientRect();
    const lineElemPos = lineELemTop - editorTop;
    const lineElemBlockInfo = view.lineBlockAtHeight(lineElemPos);
    const lineData = view.state.doc.lineAt(lineElemBlockInfo.from);

    const trx = view.state.update({
      effects: addCommentCompartment.reconfigure([
        addCommentPlugin(lineData.from),
      ]),
    });
    view.dispatch(trx);
  },
  mouseleave: (_evt, view) => {
    const trx = view.state.update({
      effects: addCommentCompartment.reconfigure([]),
    });
    view.dispatch(trx);
  },
});
