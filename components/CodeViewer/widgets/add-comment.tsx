import styles from "../CodeViewer.module.css";

import { SquarePlus } from "@/components/Icons";
import { Compartment } from "@codemirror/state";
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
import { getLineElem } from "../helpers/get-line-elem";

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

    iconContainer.classList.add("cm-add-icon-container");
    iconContainer.innerHTML = iconMarkup;
    this.attachEvents(iconContainer);

    return iconContainer;
  }

  attachEvents(widgetContainer: HTMLSpanElement) {
    widgetContainer.addEventListener("click", (evt) => {
      console.log("Show comment box below code line", evt.target);
      if (!this.view) return;
      const editorTop = this.view.documentTop;
      const elem = evt.target as HTMLElement;
      const lineElem = getLineElem(elem);
      const { top: lineELemTop } = lineElem.getBoundingClientRect();
      const lineElemPos = lineELemTop - editorTop;
      const lineElemBlockInfo = this.view.lineBlockAtHeight(lineElemPos);
      const lineData = this.view.state.doc.lineAt(lineElemBlockInfo.from);
      const pos = lineData.text ? lineData.to : lineData.to + 1;

      addCommentBoxStore.add(pos);

      console.log(lineElem, lineData, addCommentBoxStore.store);
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
