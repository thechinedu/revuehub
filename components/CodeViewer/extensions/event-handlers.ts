import { EditorView } from "@codemirror/view";

import { getLineData, getLineElem } from "../helpers";
import { addCommentCompartment, addCommentPlugin } from "../widgets";
import { multiLineCommentStore } from "../widgets/add-comment";
import {
  lineDecorationSet,
  lineHighlightCompartment,
} from "../widgets/line-highlight";

export const eventHandlers = EditorView.domEventHandlers({
  mouseover: (evt, view) => {
    const elem = evt.target as HTMLElement;

    if (elem.classList.contains("cm-content")) return;

    const lineElem = getLineElem(elem);
    const lineData = getLineData(lineElem, view);

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
  dragover: (evt, view) => {
    evt.preventDefault();
    if (evt.dataTransfer) evt.dataTransfer.dropEffect = "copy";

    const elem = evt.target as HTMLElement;

    if (elem.classList.contains("cm-content")) return;

    const { doc } = view.state;
    const lineElem = getLineElem(elem);
    const lineData = getLineData(lineElem, view);

    const { number: key, length: _, ...remainingLineData } = lineData;

    multiLineCommentStore.add(key, remainingLineData);

    if (multiLineCommentStore.hasSkippedLines()) {
      const editorDocument = doc as typeof doc & { text: string[] | undefined };

      multiLineCommentStore.setDataForSkippedLines({
        textNode: editorDocument.children,
        textLeaf: editorDocument.text,
      });
    }

    const editorTop = view.documentTop;
    const pointerYPos = evt.clientY;
    const lineElemPos = pointerYPos - editorTop;
    const pointerLineElemBlockInfo = view.lineBlockAtHeight(lineElemPos);
    const pointerLineData = doc.lineAt(pointerLineElemBlockInfo.from);
    const { number } = pointerLineData;

    multiLineCommentStore.removeInactiveLines(number);

    const trx = view.state.update({
      effects: lineHighlightCompartment.reconfigure(
        multiLineCommentStore.highlightLines()
      ),
    });
    view.dispatch(trx);
  },
});
