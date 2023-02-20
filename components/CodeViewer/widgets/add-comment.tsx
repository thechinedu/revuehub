import styles from "../CodeViewer.module.css";

import { SquarePlus } from "@/components/Icons";
import { Compartment, Line } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  WidgetType,
} from "@codemirror/view";
import { renderToStaticMarkup } from "react-dom/server";

import {
  addCommentBoxCompartment,
  addCommentBoxStore,
  commentBoxDecorationSet,
} from "./add-comment-box";
import { getLineData, getLineElem } from "../helpers";

type LineData = Pick<Line, "from" | "to" | "text">;

export const multiLineCommentStore = {
  store: new Map<number, LineData>(),
  storee: new Map<number, LineData>(),

  add(key: number, value: LineData) {
    this.store.set(key, value);
  },

  addD(key: number, value: LineData) {
    this.storee.set(key, value);
  },

  get(key: number) {
    return this.store.get(key);
  },

  getD(key: number) {
    return this.storee.get(key);
  },

  remove(key: number) {
    this.store.delete(key);
  },

  reset() {
    this.store.clear();
    this.storee.clear();
  },

  hasSkippedLines() {
    return true;
  },
};

class AddCommentWidget extends WidgetType {
  view: EditorView | null;

  constructor() {
    super();

    this.view = null;
  }

  toDOM(view: EditorView): HTMLElement {
    // console.log("creating add comment icon widget");
    this.view = view;

    const iconContainer = document.createElement("span");
    const iconMarkup = renderToStaticMarkup(
      <SquarePlus className={styles.addCommentIcon} />
    );

    iconContainer.draggable = true;
    iconContainer.classList.add("cm-add-icon-container");
    iconContainer.innerHTML = iconMarkup;
    this.attachListeners(iconContainer);

    return iconContainer;
  }

  attachListeners(widgetContainer: HTMLSpanElement) {
    widgetContainer.addEventListener("click", (evt) => {
      // console.log("Show comment box below code line", evt.target);
      if (!this.view) return;
      const elem = evt.target as HTMLElement;
      const lineElem = getLineElem(elem);
      const lineData = getLineData(lineElem, this.view);
      const pos = lineData.text ? lineData.to : lineData.to + 1;

      addCommentBoxStore.add(pos);

      // console.log(lineElem, lineData, addCommentBoxStore.store);
      // const foo = addCommentBoxCompartment.get(this.view.state);
      // console.log({ foo });
      const trx = this.view.state.update({
        effects: addCommentBoxCompartment.reconfigure(
          addCommentBoxStore.generateDecorations()
        ),
        // effects: StateEffect.appendConfig.of(commentBoxDecorationSet(60)),
      });
      this.view.dispatch(trx);
    });

    // widgetContainer.addEventListener("mousedown", (evt) => {
    //   console.log("mousedown");
    //   // addCommentIconStore.add("isDragging", true);
    //   // set isDragging to active (user is potentially dragging)
    //   // prevent iconContainer compartment from being reconfigured in event-handlers.ts (using the isDragging flag)
    //   // get lineData of elem --> represents start line
    //   // add lineData to lineEntries
    // });

    // widgetContainer.addEventListener("mousemove", (evt) => {
    //   // if (!addCommentIconStore.get("isDragging")) return false;
    //   console.log(
    //     "mousemove: prevent click from registering. Prevent icon from being reconfigured"
    //   );
    //   // Only fire if isDragging is set to active
    //   // get active line elem, indicate that is is being selected as part of a multi-line comment
    //   // get lineData of elem
    //   // add every lineData object to lineEntries
    // });

    // widgetContainer.addEventListener("mouseup", (evt) => {
    //   // addCommentIconStore.remove("isDragging");
    //   console.log("mouseup: get lines selected. auto inject comment box");
    //   // get line data of elem --> represents end line
    //   // add lineData to lineEntries

    //   // remove mousemove listener
    //   // set isDragging to inactive
    //   // sort data in lineEntries in asc order --> represents start-line - lines selected - end-line
    //   // auto-trigger click event to ensure that add comment box shows up beneath end line
    // });

    widgetContainer.addEventListener("dragstart", (evt) => {
      // addCommentIconStore.add("isDragging", true);
      if (evt.dataTransfer) evt.dataTransfer.effectAllowed = "copyMove";

      if (!this.view) return;

      console.log("dragStart: isDragging");

      const elem = evt.target as HTMLElement;

      if (elem.classList.contains("cm-content")) return;

      const lineElem = getLineElem(elem);
      const lineData = getLineData(lineElem, this.view);

      lineElem.classList.add("cm-dragover-line");

      const { number: key, length: _, ...remainingLineData } = lineData;

      multiLineCommentStore.add(key, remainingLineData);

      // console.log(lineData);
    });

    widgetContainer.addEventListener("drag", (evt) => {
      // // console.log(evt.clientX, evt.clientY);
      if (!this.view) return;
      const editorTop = this.view.documentTop;
      const lineElemTop = evt.clientY;
      const lineElemPos = lineElemTop - editorTop;
      const lineElemBlockInfo = this.view.lineBlockAtHeight(lineElemPos);
      const doc = this.view.state.doc.lineAt(lineElemBlockInfo.from);
      const { number, ...data } = doc;

      multiLineCommentStore.addD(number, data);
      // console.log({ lineElemBlockInfo, lineElemTop, doc });
    });

    widgetContainer.addEventListener("dragend", (evt) => {
      console.log(
        "dragEnd: is no longer dragging",
        "will reset compartment",
        Boolean(this.view)
      );
      if (!this.view) return;
      console.log(multiLineCommentStore.store);
      console.log(multiLineCommentStore.storee);
      console.log(this.view.state.doc);
      // const editorTop = this.view.documentTop;
      // const lineElemTop = evt.clientY;
      // const lineElemPos = lineElemTop - editorTop;
      // const lineElemBlockInfo = this.view.lineBlockAtHeight(lineElemPos);
      // const doc = this.view.state.doc.lineAt(lineElemBlockInfo.from);
      // const { number, ...data } = doc;
      // console.log(doc);
      // widgetContainer.dispatchEvent(new Event("click"));
      // widgetContainer.click()
      // addCommentBoxStore.add(49);
      // const trx = this.view.state.update({
      //   effects: addCommentCompartment.reconfigure(
      //     addCommentBoxStore.generateDecorations()
      //   ),
      // });
      // this.view.dispatch(trx);
      // widgetContainer.remove();
    });
  }
}

export const addCommentCompartment = new Compartment();

export const addCommentPlugin = (pos: number) =>
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor() {
        const addCommentDecoration = Decoration.widget({
          widget: new AddCommentWidget(),
        });
        this.decorations = Decoration.set([addCommentDecoration.range(pos)]);
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );

/**
 * Support multi-line comments
 *
 * Add support for line-decoration widgets (required to highlight active selected lines)
 *
 * onDragStart:
 *  * Save line data (range, number, text) of current line
 *  * Add line data range to line-decoration widget which will highlight the line
 *
 * onDragOver:
 *  * Perform the same operation as onDragStart
 *  -- One thing to note is that if the mouse cursor moves very fast, there is a high chance that lines will be skipped
 *  -- to handle this case, have a check to see if any lines have been skipped (sequential progression will be broken)
 *  -- to detect skipped lines, e.g (line data of 1,8,10 means we need data for 2,3,4,5,6,7 and 9)
 *     iterate over the line-data store sorted by line number (key) and if the if the difference between two lines is greater than 1
 *     get the skipped lines between the two lines from the text document (view.state.doc.children || view.state.doc.text)
 *     update line data with skipped lines, update line-decoration widgets
 *
 *  -- Another thing, lines can be deselected as a user performs a drag operation
 *  -- to handle this case, get the current coordinates of the mouse cursor
 *  -- get the line-data that corresponds to the mouse cursor coordinates (mcc line-data)
 *  -- update line-data store by removing every line number greater than mcc line-data
 *  -- update line-decoration widgets
 *
 * onDragEnd:
 *  * Run skipped lines rule like for onDragOver
 *  * Run deselected lines rule like for onDragOver
 *  * Update line-data if necessary
 *  * Remove add-comment icon
 *  * Display add-comment box (showing line info for selected lines)
 */
