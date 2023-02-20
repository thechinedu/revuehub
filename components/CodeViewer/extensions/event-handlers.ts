import { EditorView } from "@codemirror/view";

import { getLineData, getLineElem } from "../helpers";
import { addCommentCompartment, addCommentPlugin } from "../widgets";
import { multiLineCommentStore } from "../widgets/add-comment";

export const eventHandlers = EditorView.domEventHandlers({
  mouseover: (evt, view) => {
    const elem = evt.target as HTMLElement;

    if (elem.classList.contains("cm-content")) return;

    // if (addCommentIconStore.get("isDragging")) return;
    const lineElem = getLineElem(elem);
    const lineData = getLineData(lineElem, view);

    const { number: key, length: _, ...remainingLineData } = lineData;

    multiLineCommentStore.addD(key, remainingLineData);

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

    const lineElem = getLineElem(elem);
    const lineData = getLineData(lineElem, view);
    // console.log({ line: lineData.number });

    const { number: key, length: _, ...remainingLineData } = lineData;

    lineElem.classList.add("cm-highlight-line");

    multiLineCommentStore.add(key, remainingLineData);

    if (multiLineCommentStore.hasSkippedLines()) {
      // update multiline comment store: add line data for skipped lines
      // add highlight class to skipped line elements
    }
  },
});
