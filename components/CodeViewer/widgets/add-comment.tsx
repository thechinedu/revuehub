import styles from "../CodeViewer.module.css";

import { SquarePlusIcon } from "@/components/Icons";
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
import { CommentBoxMode } from "../AddCommentBox";

type LineData = Pick<Line, "from" | "to" | "text">;
type Leaf = Text & { text: string[] };

export const multiLineCommentStore = new (class {
  private readonly store = new Map<number, LineData>();
  private startLineAtPointOfDragStart: number | null = null;

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

  removeInactiveLines(lineNumberAtMouseCursorPosition: number) {
    const startLineAtDragStart = this.startLineAtPointOfDragStart;
    const startLine = this.getStartLine();
    const endLine = this.getEndLine();

    // User drags line highlight upwards past the initial point of where they started the drag operation
    // e.g User starts dragging from line 8 and moves upwards towards lower line numbers (line 7,6,5...)
    // Operation ensures line numbers from the mouse current position to the initial line number at the start of the drag operation are highlighted
    if (
      startLineAtDragStart != null &&
      lineNumberAtMouseCursorPosition < startLineAtDragStart
    ) {
      const activeLines = new Set<number>();
      for (
        let key = lineNumberAtMouseCursorPosition;
        key <= startLineAtDragStart;
        key += 1
      ) {
        activeLines.add(key);
      }

      for (const key of Array.from(this.store.keys())) {
        if (activeLines.has(key)) continue;

        this.remove(key);
      }
      return;
    }

    // User drags line highlight past the stored end line for the multi-line comment
    // e.g User initially highlights line 8 - 15 (drags over 8 - 15) and then moves the cursor upwards towards lower numbers (line 14, 13...)
    // Operation ensures line numbers from start line to the mouse's current position are highlighted
    if (lineNumberAtMouseCursorPosition < endLine) {
      for (let key = endLine; key > lineNumberAtMouseCursorPosition; key -= 1) {
        this.remove(key);
      }
    }

    // User drags line highlight downwards past the initial point of where they started the drag operation and
    // then drag line highlight upwards past the point of where they started the drag
    // e.g User starts dragging from line 8, drags over line 9, 10, 11, 12 and then moves the drag upwards
    // such that they drag over 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 and then finally moves the cursor downwards again
    // such that they drag past 1,2,3,4 and then stop the drag operation
    // Operation ensures that the line highlight starts at the point where the mouse cursor stopped
    if (startLineAtDragStart != null && startLine !== startLineAtDragStart) {
      for (let key = startLine; key < startLineAtDragStart; key += 1) {
        this.remove(key);
      }
    }
  }

  setStartLineAtPointOfDragStart(line: number) {
    this.startLineAtPointOfDragStart = line;
  }

  getStartLine() {
    return this.sortedKeys[0];
  }

  getEndLine() {
    return this.sortedKeys[this.sortedKeys.length - 1];
  }

  getSnippet(): string {
    const lines = this.sortedKeys.map((key) => this.get(key)?.text ?? "");

    return lines.join("\n");
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
      <SquarePlusIcon className={styles.addCommentIcon} />
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

      addCommentBoxStore.add(pos, [
        {
          value: "",
          isSubmitDisabled: true,
          commentLineReference: `Commenting on line ${lineData.number}`,
          snippet: lineData.text,
          startLine: lineData.number,
          endLine: lineData.number,
          mode: CommentBoxMode.ADD,
        },
      ]);

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
      multiLineCommentStore.setStartLineAtPointOfDragStart(key);
    });

    // TODO: is this still required? remove if no longer needed
    // widgetContainer.addEventListener("drag", (evt) => {
    //   if (!this.view) return;

    //   const editorTop = this.view.documentTop;
    //   const lineElemTop = evt.clientY;
    //   const lineElemPos = lineElemTop - editorTop;
    //   const lineElemBlockInfo = this.view.lineBlockAtHeight(lineElemPos);
    //   const doc = this.view.state.doc.lineAt(lineElemBlockInfo.from);
    //   const { number, ...data } = doc;
    // });

    widgetContainer.addEventListener("dragend", (evt) => {
      if (!this.view) return;

      const startLine = multiLineCommentStore.getStartLine();
      const endLine = multiLineCommentStore.getEndLine();
      const lineData = multiLineCommentStore.get(endLine);

      if (lineData) {
        const pos = lineData.text ? lineData.to : lineData.to + 1;

        addCommentBoxStore.add(pos, [
          {
            value: "",
            isSubmitDisabled: true,
            commentLineReference: `Commenting on lines ${startLine} to ${endLine}`,
            snippet: multiLineCommentStore.getSnippet(),
            startLine,
            endLine,
            mode: CommentBoxMode.ADD,
          },
        ]);

        const trx = this.view.state.update({
          effects: addCommentBoxCompartment.reconfigure(
            addCommentBoxStore.generateDecorations()
          ),
        });
        this.view.dispatch(trx);
      }
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
