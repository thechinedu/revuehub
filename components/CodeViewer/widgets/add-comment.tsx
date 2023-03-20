import styles from "../CodeViewer.module.css";

import { SquarePlus } from "@/components/Icons";
import { Compartment, Line, Text } from "@codemirror/state";
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
import { lineDecorationSet, lineHighlightCompartment } from "./line-highlight";

type LineData = Pick<Line, "from" | "to" | "text">;
type Leaf = Text & { text: string[] };

export const multiLineCommentStore = new (class {
  // TODO: Mark as private
  readonly store = new Map<number, LineData>();

  add(key: number, value: LineData) {
    this.store.set(key, value);
  }

  get(key: number) {
    return this.store.get(key);
  }

  remove(key: number) {
    this.store.delete(key);
  }

  reset() {
    this.store.clear();
  }

  highlightLines() {
    return Array.from(this.store.values()).map(({ from }) =>
      lineDecorationSet(from)
    );
  }

  hasSkippedLines() {
    return this.sortedKeys.some((item, idx, arr) => {
      const nextItem = arr[idx + 1];

      if (typeof nextItem === "undefined") return false;

      return nextItem - item !== 1;
    });
  }

  setDataForSkippedLines({
    textNode,
    textLeaf,
  }: {
    textNode: readonly Text[] | null;
    textLeaf: string[] | undefined;
  }) {
    const skippedLines = this.getSkippedLines();
    const startLine = this.getStartLine();
    const endLine = this.getEndLine();

    if (textNode?.length) {
      const subsets: Text[] = [];
      let subsetStart = 0;
      let subsetEnd = textNode[0].lines;

      for (let i = 0; i < textNode.length; i += 1) {
        const node = textNode[i];
        const nextNode = textNode[i + 1];

        if (subsetStart + node.lines < startLine) {
          subsetStart += node.lines;

          if (nextNode) subsetEnd += nextNode.lines;

          continue;
        } else if (subsetStart + node.lines === startLine) {
          subsetStart += node.lines;
        }

        subsets.push(node);

        if (subsetEnd >= endLine) {
          break;
        }

        if (nextNode) subsetEnd += nextNode.lines;
      }

      const flattenedSubsets = subsets.flatMap((textNode) =>
        textNode.children?.flatMap(
          (textLeaf: unknown) => (textLeaf as Leaf).text
        )
      ) as string[];

      this.addSkippedLinesData(
        skippedLines,
        (skippedLine) =>
          flattenedSubsets[((skippedLine - 1) % subsetEnd) - subsetStart]
      );
    }

    if (textLeaf?.length) {
      this.addSkippedLinesData(
        skippedLines,
        (skippedLine) => textLeaf[skippedLine - 1]
      );
    }
  }

  removeInactiveLines(line: number) {
    // line represents current line that mouse cursor is hovering
    // if line is less than endLine (user moved pointer upwards, deselect all lines after)
    //  - remove every line number greater than line and deselect all lines after the current line
    // if line is less than startLine (user moved cursor upwards past startLine)
    //  - get start line at drag start
    //  - highlight new lines (start line at drag is new endLine and current pointer line is new startLine)
    const startLine = this.getStartLine();
    const endLine = this.getEndLine();

    if (line < endLine) {
      for (let key = endLine; key > line; key -= 1) {
        this.remove(key);
      }
    }
  }

  private getSkippedLines(): number[] {
    const result = [];

    for (let i = 0; i < this.sortedKeys.length; i += 1) {
      const num = this.sortedKeys[i];
      const nextNum = this.sortedKeys[i + 1];

      if (typeof nextNum !== "undefined" && nextNum - num > 1) {
        let j = num + 1;

        while (j < nextNum) {
          result.push(j);

          j += 1;
        }
      }
    }

    return result;
  }

  private getStartLine() {
    return this.sortedKeys[0];
  }

  private getEndLine() {
    return this.sortedKeys[this.sortedKeys.length - 1];
  }

  private addSkippedLinesData(
    skippedLines: number[],
    getText: (line: number) => string
  ) {
    for (const skippedLine of skippedLines) {
      const closestLineDataEntry = this.get(skippedLine - 1);
      const text = getText(skippedLine);

      if (closestLineDataEntry && typeof text !== "undefined") {
        const from = closestLineDataEntry.to + 1;
        const to = from + text.length;

        const skippedLineData = {
          from,
          to,
          text,
        };

        this.add(skippedLine, skippedLineData);
      }
    }
  }

  private get sortedKeys() {
    return Array.from(this.store.keys()).sort((a, b) => a - b);
  }
})();

class AddCommentWidget extends WidgetType {
  view: EditorView | null;

  constructor() {
    super();

    this.view = null;
  }

  toDOM(view: EditorView): HTMLElement {
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
      if (!this.view) return;
      const elem = evt.target as HTMLElement;
      const lineElem = getLineElem(elem);
      const lineData = getLineData(lineElem, this.view);
      const pos = lineData.text ? lineData.to : lineData.to + 1;

      addCommentBoxStore.add(pos);

      const trx = this.view.state.update({
        effects: addCommentBoxCompartment.reconfigure(
          addCommentBoxStore.generateDecorations()
        ),
      });
      this.view.dispatch(trx);
    });

    widgetContainer.addEventListener("dragstart", (evt) => {
      if (evt.dataTransfer) evt.dataTransfer.effectAllowed = "copyMove";

      if (!this.view) return;

      const elem = evt.target as HTMLElement;

      const lineElem = getLineElem(elem);
      const lineData = getLineData(lineElem, this.view);

      const { number: key, length: _, ...remainingLineData } = lineData;

      multiLineCommentStore.add(key, remainingLineData);
    });

    // TODO: is this still required? remove if no longer needed
    widgetContainer.addEventListener("drag", (evt) => {
      if (!this.view) return;

      const editorTop = this.view.documentTop;
      const lineElemTop = evt.clientY;
      const lineElemPos = lineElemTop - editorTop;
      const lineElemBlockInfo = this.view.lineBlockAtHeight(lineElemPos);
      const doc = this.view.state.doc.lineAt(lineElemBlockInfo.from);
      const { number, ...data } = doc;
    });

    widgetContainer.addEventListener("dragend", (evt) => {
      if (!this.view) return;

      console.log(multiLineCommentStore.store);
      console.log(this.view.state.doc);
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
